import { AI_SYSTEM_PROMPT } from '../data/aiPrompt.js'
import { AI_CONFIG } from '../config/aiConfig.js'

/**
 * AI Engine — manages chat history and communicates with DeepSeek API.
 * Falls back gracefully when API key is not configured.
 */

const MAX_HISTORY = 20

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

  /**
   * Check if the API key is configured (not the placeholder value).
   */
  isConfigured() {
    return AI_CONFIG.apiKey && AI_CONFIG.apiKey !== 'YOUR_DEEPSEEK_API_KEY'
  }

  /**
   * Send a message to the API and return the response.
   * @param {string} userMessage
   * @returns {Promise<string>} AI response text
   */
  async sendMessage(userMessage) {
    this.init()

    // Add user message to history
    this.history.push({
      role: 'user',
      content: userMessage,
    })

    // Trim history if too long (keep system prompt + last N messages)
    if (this.history.length > MAX_HISTORY + 1) {
      const systemMsg = this.history[0]
      this.history = [systemMsg, ...this.history.slice(-(MAX_HISTORY - 1))]
    }

    // If API not configured, return fallback response
    if (!this.isConfigured()) {
      const fallback = this.getFallbackResponse(userMessage)
      this.history.push({
        role: 'assistant',
        content: fallback,
      })
      return fallback
    }

    try {
      const response = await fetch(AI_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AI_CONFIG.apiKey}`,
        },
        body: JSON.stringify({
          model: AI_CONFIG.model,
          messages: this.history,
          temperature: 0.8,
          max_tokens: 500,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      const aiMessage = data.choices[0]?.message?.content || '抱歉，我没有理解您的意思。'

      this.history.push({
        role: 'assistant',
        content: aiMessage,
      })

      return aiMessage
    } catch (error) {
      const errorMsg = '网络连接出了点问题，请稍后再试。'
      this.history.push({
        role: 'assistant',
        content: errorMsg,
      })
      return errorMsg
    }
  }

  /**
   * Fallback response when API is not configured.
   */
  getFallbackResponse(userMessage) {
    const msg = userMessage.toLowerCase()

    if (msg.includes('作品') || msg.includes('有哪些')) {
      return '我有平面设计（海报、页面）、视频剪辑（AIGC短片）、三维建模（角色渲染）和6款小游戏（贪吃蛇、五子棋、扫雷等）作品。请在导航栏点击 Works 查看全部！'
    }
    if (msg.includes('游戏') || msg.includes('玩')) {
      return '我有6款小游戏可以直接在浏览器玩：贪吃蛇、五子棋、扫雷、蜘蛛纸牌、跳一跳、魂斗罗。前往 Works 页面找到基础逻辑分类即可体验！'
    }
    if (msg.includes('联系') || msg.includes('合作') || msg.includes('微信')) {
      return '您可以通过点击导航栏右侧的"Hire me"按钮扫描我的微信二维码，或发送邮件到 etta120913@gmail.com 联系我。期待与您的合作！'
    }
    if (msg.includes('网站') || msg.includes('谁做')) {
      return '这个网站是由 Laser（伊泽）用 React + Vite + Tailwind CSS 精心搭建的，是他送给我的作品集礼物。'
    }
    if (msg.includes('你好') || msg.includes('hi') || msg.includes('hello')) {
      return '你好！我是 Etta，欢迎来到我的个人作品集。有什么想了解的？'
    }

    return '感谢您的留言！AI对话功能正在配置中，暂时无法实时回复。您可以浏览我的作品，或通过微信/邮箱联系我。'
  }

  /**
   * Clear conversation history (keeps system prompt).
   */
  clearHistory() {
    this.history = []
    this.initialized = false
    this.init()
  }
}

// Singleton instance
export const aiEngine = new AIEngine()
