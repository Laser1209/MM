/**
 * 动作解析器 — 把 AI 输出解析成程序可执行的"跳转动作"
 *
 * 支持两种 AI 输出格式（双层识别）：
 *  1. Function Calling：从 message.tool_calls 里取 navigate_to_interface 工具调用
 *  2. JSON 模式：从 JSON 字符串的 action 字段解析
 *
 * 解析后统一进入 resolveAction()：
 *  - 命中 id          → status 'navigate'（直接跳转）
 *  - 模糊命中多个     → status 'clarify'（附候选列表，让用户选）
 *  - 完全没命中       → status 'not_found'（触发兜底提示）
 */

import {
  findInterfaceById,
  searchInterfaces,
} from '../data/interfaceCatalog.js'

// AI 请求跳转时使用的工具名（与 aiPrompt / aiEngine 保持一致）
export const NAVIGATE_TOOL = 'navigate_to_interface'

/** 把一个清单条目转换为可执行的动作对象 */
function toAction(itf) {
  return {
    type: 'navigate',
    id: itf.id,
    route: itf.route,
    title: itf.title,
    thumbnail: itf.thumbnail,
    scrollTo: itf.scrollTo,
  }
}

/**
 * 把用户描述 / 工具参数解析为跳转结果
 * @param {{id?:string, title?:string, query?:string}} args
 * @returns {{status:'navigate', action:object} | {status:'clarify', candidates:Array} | {status:'not_found', candidates:Array}}
 */
export function resolveAction(args = {}) {
  // 1) 先按精确 id 命中
  if (args.id) {
    const itf = findInterfaceById(args.id)
    if (itf) return { status: 'navigate', action: toAction(itf) }
  }

  // 2) 再按标题 / 关键词做本地模糊匹配
  const q = (args.title || args.query || '').trim()
  const matches = q ? searchInterfaces(q) : []
  if (matches.length === 1) {
    return { status: 'navigate', action: toAction(matches[0]) }
  }
  if (matches.length > 1) {
    return { status: 'clarify', candidates: matches.slice(0, 6) }
  }

  // 3) 完全没命中
  return { status: 'not_found', candidates: [] }
}

/**
 * 从 Function Calling 的 message 中提取动作
 * @param {{content?:string, tool_calls?:Array}} message  DeepSeek 返回的 message 对象
 * @returns {{source:string, result:object, text:string}}
 */
export function extractActionFromToolCall(message = {}) {
  const text = message.content || ''
  const calls = message.tool_calls || []
  const call = calls.find((c) => c.function?.name === NAVIGATE_TOOL)
  if (!call) {
    return { source: 'tool_call', result: null, text }
  }
  try {
    const args = JSON.parse(call.function.arguments || '{}')
    return { source: 'tool_call', result: resolveAction(args), text }
  } catch {
    return { source: 'tool_call', result: { status: 'not_found', candidates: [] }, text }
  }
}

/**
 * 从 JSON 模式输出的 content 中提取动作
 * 约定 JSON 结构：{ "text": "回复文案", "action": { "id": "目标id" } }
 * @param {string} content
 * @returns {{source:string, result:object, text:string}}
 */
export function extractActionFromJson(content = '') {
  try {
    const obj = JSON.parse(content)
    if (obj && obj.action) {
      return {
        source: 'json',
        result: resolveAction(obj.action),
        text: typeof obj.text === 'string' ? obj.text : content,
      }
    }
    return { source: 'json', result: null, text: typeof obj?.text === 'string' ? obj.text : content }
  } catch {
    return { source: 'json', result: null, text: content }
  }
}
