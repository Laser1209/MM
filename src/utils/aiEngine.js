import { AI_SYSTEM_PROMPT } from '../data/aiPrompt.js'
import { AI_CONFIG } from '../config/aiConfig.js'
import {
  NAVIGATE_TOOL,
  extractActionFromToolCall,
  extractActionFromJson,
} from './actionParser.js'
import { searchInterfaces } from '../data/interfaceCatalog.js'
import { pruneHistory } from './tokenPrune.js'
import { getLocalAnswer, isNavIntent, isInfoIntent } from './localAnswer.js'

/**
 * AI Engine — 对话 + 界面调用
 *
 * 识别策略（双层 + 本地兜底，保证任何情况下都能用）：
 *  1. Function Calling：请求带 tools，模型原生返回结构化 tool_calls
 *  2. JSON 模式：Function Calling 失败/异常时，用 response_format 强制合法 JSON
 *  3. 本地兜底：无 API Key 或 API 完全不可用时，走关键词/本地匹配
 *
 * sendMessage 统一返回：
 *  { text, action, candidates, status }
 *    text       — 展示在气泡里的回复文案
 *    action     — status 为 'navigate' 时的跳转动作对象，否则 null
 *    candidates — status 为 'clarify' 时的候选界面列表，否则 []
 *    status     — 'navigate' | 'clarify' | 'none' | 'not_found'
 */

// Function Calling 工具定义：让模型请求跳转界面
const NAVIGATE_TOOL_DEF = {
  type: 'function',
  function: {
    name: NAVIGATE_TOOL,
    description:
      '仅当访客明确要"前往/打开/跳转/进入/访问"某个界面、作品页面或分区时才调用，并传入界面清单中匹配到的唯一 id。' +
      '若访客只是询问、了解、介绍某个作品或项目（例如"XX是什么项目""介绍一下XX""讲讲XX""亲口说/输出内容"），不要调用本工具，直接在回复正文中回答。',
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: '界面清单中的唯一 id，例如 ai-aerie、works-all、easter-egg',
        },
      },
      required: ['id'],
    },
  },
}

/** 把界面清单条目转成可执行动作（本地兜底复用） */
function toNavigateAction(itf) {
  return {
    type: 'navigate',
    id: itf.id,
    route: itf.route,
    title: itf.title,
    thumbnail: itf.thumbnail,
    scrollTo: itf.scrollTo,
  }
}

export class AIEngine {
  constructor() {
    this.history = []
    this.initialized = false
  }

  init() {
    if (this.initialized) return
    this.history.push({
      role: 'system',
      content: AI_SYSTEM_PROMPT,
    })
    this.initialized = true
  }

  isConfigured() {
    return AI_CONFIG.apiKey && AI_CONFIG.apiKey !== 'YOUR_DEEPSEEK_API_KEY'
  }

  pushAssistant(text) {
    this.history.push({ role: 'assistant', content: text })
  }

  /**
   * 发送消息并返回 { text, action, candidates, status }
   * @param {string} userMessage
   */
  async sendMessage(userMessage) {
    this.init()

    this.history.push({ role: 'user', content: userMessage })

    // 裁剪历史：保留 system（前缀缓存友好）+ 尽量多最近消息，按 token 预算裁剪
    this.history = pruneHistory(this.history)

    // ---- 本地规则先行：内容解答类提问确定性命中，彻底杜绝误跳转（不进 LLM） ----
    const local = getLocalAnswer(userMessage)
    if (local) {
      this.pushAssistant(local.text)
      return { text: local.text, action: null, candidates: [], status: 'none' }
    }

    // 无 Key → 直接本地兜底
    if (!this.isConfigured()) {
      const fb = this.getFallbackResponse(userMessage)
      this.pushAssistant(fb.text)
      return fb
    }

    // ---- 第 1 层：Function Calling ----
    try {
      const msg = await this.requestFunctionCall()
      const parsed = extractActionFromToolCall(msg)
      return this.applyParsed(parsed, userMessage)
    } catch {
      // 失败则进入第 2 层
    }

    // ---- 第 2 层：JSON 模式 ----
    try {
      const parsed = await this.requestJsonMode()
      return this.applyParsed(parsed, userMessage)
    } catch {
      // 失败则进入本地兜底
    }

    const fb = this.getFallbackResponse(userMessage)
    this.pushAssistant(fb.text)
    return fb
  }

  /** 统一处理解析结果，转成对外返回结构 */
  applyParsed(parsed, userMessage) {
    const result = parsed.result
    if (result?.status === 'navigate') {
      // 防御：内容解答类意图即使模型误判为导航，也降级为正文回答，绝不跳转
      if (!isNavIntent(userMessage) && isInfoIntent(userMessage)) {
        const local = getLocalAnswer(userMessage)
        const text = local ? local.text : parsed.text || '好的，我直接在正文为您讲解。'
        this.pushAssistant(text)
        return { text, action: null, candidates: [], status: 'none' }
      }
      const text = parsed.text || `好的，我带您前往「${result.action.title}」。`
      this.pushAssistant(text)
      return { text, action: result.action, candidates: [], status: 'navigate' }
    }
    if (result?.status === 'clarify') {
      const text = parsed.text || '我找到几个相近的界面，您想打开哪一个？'
      this.pushAssistant(text)
      return { text, action: null, candidates: result.candidates || [], status: 'clarify' }
    }
    if (result?.status === 'not_found') {
      const text = parsed.text || '抱歉，我暂时没找到与您描述匹配的界面。'
      this.pushAssistant(text)
      return { text, action: null, candidates: [], status: 'not_found' }
    }
    // 无动作 → 普通对话
    const text = parsed.text || '抱歉，我没有理解您的意思。'
    this.pushAssistant(text)
    return { text, action: null, candidates: [], status: 'none' }
  }

  /** 第 1 层：Function Calling 请求 */
  async requestFunctionCall() {
    const res = await fetch(AI_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: this.history,
        temperature: 0.6,
        max_tokens: 500,
        tools: [NAVIGATE_TOOL_DEF],
        tool_choice: 'auto',
      }),
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const data = await res.json()
    const msg = data.choices?.[0]?.message || {}
    // 记录历史：保留 tool_calls 以保证对话完整性（跳转属终态，面板会执行）
    this.history.push(msg)
    return msg
  }

  /** 第 2 层：JSON 模式请求（在末尾用户消息追加 JSON 指令） */
  async requestJsonMode() {
    const messages = this.history.map((m) => ({ ...m }))
    const last = messages[messages.length - 1]
    if (last && last.role === 'user') {
      last.content =
        last.content +
        '\n\n【输出要求】请严格以合法 JSON 输出，结构为 {"text":"给用户的回复文案","action":{"id":"匹配到的界面id"}}；若无法匹配任何界面则省略 action。'
    }
    const res = await fetch(AI_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages,
        temperature: 0.4,
        max_tokens: 600,
        response_format: { type: 'json_object' },
      }),
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const data = await res.json()
    const content = data.choices?.[0]?.message?.content || '{}'
    return extractActionFromJson(content)
  }

  /**
   * 本地兜底：先做界面模糊匹配，命中则跳转；多命中则给候选；否则走关键词回复
   */
  getFallbackResponse(userMessage) {
    const msg = String(userMessage).toLowerCase()

    // 1) 本地界面匹配
    const matches = searchInterfaces(msg)
    if (matches.length === 1) {
      const itf = matches[0]
      const text = `好的，我带您前往「${itf.title}」。`
      return { text, action: toNavigateAction(itf), candidates: [], status: 'navigate' }
    }
    if (matches.length > 1) {
      const text = '我为您找到了几个相近的界面，请选择：'
      return { text, action: null, candidates: matches.slice(0, 6), status: 'clarify' }
    }

    // 2) 关键词回复（原有逻辑）
    if (msg.includes('作品') || msg.includes('有哪些')) {
      return {
        text: '我有平面设计、视频剪辑、三维建模和多个 AI 项目等作品。您可以点下面的按钮查看全部作品！',
        action: toNavigateAction({ id: 'works-all', title: '作品总览', route: '/works' }),
        candidates: [],
        status: 'navigate',
      }
    }
    if (msg.includes('游戏') || msg.includes('玩')) {
      return {
        text: '这里有一批小游戏藏在彩蛋库里，点击下方按钮解锁吧！',
        action: toNavigateAction({ id: 'easter-egg', title: '隐藏游戏库', route: '/easter-egg' }),
        candidates: [],
        status: 'navigate',
      }
    }
    if (msg.includes('联系') || msg.includes('合作') || msg.includes('微信')) {
      return {
        text: '您可以通过点击导航栏右侧的 Hire me 扫描微信二维码，或发送邮件到 etta120913@gmail.com。',
        action: toNavigateAction({ id: 'home-contact', title: '合作咨询', route: '/', scrollTo: 'contact' }),
        candidates: [],
        status: 'navigate',
      }
    }
    if (msg.includes('网站') || msg.includes('谁做')) {
      return {
        text: '这个网站是由 Laser（伊泽）用 React + Vite + Tailwind CSS 精心搭建的，是他送给我的作品集礼物。您可以点下方查看我的主人主页！',
        action: toNavigateAction({ id: 'home', title: '首页', route: '/' }),
        candidates: [],
        status: 'navigate',
      }
    }
    if (msg.includes('你好') || msg.includes('hi') || msg.includes('hello')) {
      return { text: '你好！我是 Etta，欢迎来到主人的个人作品集。有什么想了解的？', action: null, candidates: [], status: 'none' }
    }

    return {
      text: '抱歉，我暂时没找到匹配的界面。您可以换个说法，或直接浏览作品总览。',
      action: null,
      candidates: [],
      status: 'not_found',
    }
  }

  clearHistory() {
    this.history = []
    this.initialized = false
    this.init()
  }
}

// 单例
export const aiEngine = new AIEngine()
