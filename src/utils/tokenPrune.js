/**
 * 会话上下文裁剪工具 — 纯函数、无任何依赖，便于独立单测
 *
 * 目标：
 *  1. 前缀缓存友好：system 消息恒定固定在 index 0，保证 DeepSeek 前缀缓存命中、
 *     长会话 token 成本可控（参考 DeepSeek-Reasonix 围绕 prefix cache 的会话组织）。
 *  2. 按 token 预算裁剪历史：从最旧消息开始裁剪，始终保留 system + 尽量多的最近消息，
 *     确保最新用户消息不被裁掉。
 */

/** 非 system 部分的历史 token 预算（默认 2500） */
export const MAX_HISTORY_TOKENS = 2500

/**
 * 轻量 token 估算（不依赖分词器）：
 *  - 中文字符（CJK / 全角）≈ 1 token/字
 *  - 其余字符 ≈ 4 字符/token
 * 输入可以是字符串或 message 对象（内部 JSON 序列化兜底）。
 */
export function estimateTokens(msg) {
  const s = typeof msg === 'string' ? msg : JSON.stringify(msg || '')
  const cjk = (s.match(/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/g) || []).length
  const other = s.length - cjk
  return Math.max(1, Math.ceil(cjk + other / 4))
}

/**
 * 裁剪历史：保留 history[0]（视为 system，前缀缓存友好），
 * 其余从最旧开始裁，直到非 system 部分 token 总数不超过 MAX_HISTORY_TOKENS。
 * 至少保留最后一条（通常是最新用户消息）。
 */
export function pruneHistory(history) {
  if (!Array.isArray(history) || history.length === 0) return history
  const system = history[0]
  const rest = history.slice(1)
  const kept = []
  let used = 0
  for (let i = rest.length - 1; i >= 0; i--) {
    const cost = estimateTokens(rest[i])
    // 始终保留最末尾消息；其余在预算内尽量多保留
    if (kept.length === 0 || used + cost <= MAX_HISTORY_TOKENS) {
      kept.unshift(rest[i])
      used += cost
    } else {
      break
    }
  }
  return [system, ...kept]
}
