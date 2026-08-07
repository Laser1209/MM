/**
 * 本地确定性兜底 —「本地规则先行」
 * 把「内容解答」类提问在本地直接命中并回答，绝不进入导航 / LLM，
 * 从根上焊死"介绍 / 了解项目 → 误跳转界面"的判断边界。
 * 纯函数、仅依赖纯数据模块（workMetadata / workDetails），便于独立单测。
 */
import { WORK_METADATA, CATEGORY_STRUCTURE } from '../data/workMetadata.js'
import { WORK_DETAILS } from '../data/workDetails.js'

// 明确的内容解答意图标记（命中任一即视为"想让我在正文告诉内容"）
const INFO_MARKERS = [
  '是什么', '介绍一下', '讲讲', '了解', '详情', '介绍',
  '做什么', '干什么', '怎么样', '怎么用', '输出', '亲口说', '说说', '功能', '有啥',
]

// 明确的导航意图标记（命中即视为"想打开 / 去往某页面"，不本地解答，交由导航链路）
const NAV_MARKERS = [
  '打开', '去', '跳转', '进入', '前往', '访问', '带我去', '带我看', '打开页面',
]

// 作品清单问答标记（需同时有"作品 / 项目"语境）
const LIST_MARKERS = ['有哪些', '有什么', '几个项目', '什么作品', '哪些作品']
const LIST_CONTEXT = ['作品', '项目']

function norm(s) {
  return String(s || '').toLowerCase().trim()
}

/** 是否为明确导航意图 */
export function isNavIntent(msg) {
  const m = norm(msg)
  return NAV_MARKERS.some((k) => m.includes(k))
}

/** 是否为内容解答意图（介绍 / 了解 / 输出某内容） */
export function isInfoIntent(msg) {
  const m = norm(msg)
  return INFO_MARKERS.some((k) => m.includes(k))
}

/** 是否为"有哪些作品 / 项目"的清单意图 */
function isListIntent(msg) {
  const m = norm(msg)
  return LIST_MARKERS.some((k) => m.includes(k)) && LIST_CONTEXT.some((c) => m.includes(c))
}

/**
 * 在查询中匹配单个已知作品，返回 { work, score } 或 null。
 * 标题按非字母数字切词，命中 token 越多分越高；整句命中标题 / 命中 id 更强。
 */
function matchWork(query) {
  const q = norm(query)
  let best = null
  for (const w of WORK_METADATA) {
    const normTitle = norm(w.title)
    const titleTokens = normTitle.split(/[^\p{L}\p{N}]+/u).filter((t) => t.length >= 2)
    let score = 0
    if (q.includes(normTitle)) score += 100
    for (const t of titleTokens) {
      if (q.includes(t)) score += t.length
    }
    if (w.id && q.includes(norm(w.id))) score += 50
    if (score > (best ? best.score : 0)) best = { work: w, score }
  }
  return best && best.score >= 2 ? best : null
}

/** 依据 WORK_DETAILS（或 description）拼装单个作品的正文介绍 */
function buildProjectAnswer(work) {
  const detail = WORK_DETAILS[work.id]
  const parts = []
  if (detail && detail.overview && detail.overview.length) {
    parts.push(...detail.overview)
  } else if (work.description) {
    parts.push(work.description)
  }
  const headTag = work.tags && work.tags.length ? `（${work.tags.slice(0, 3).join(' / ')}）` : ''
  const lines = [`【${work.title}】${headTag}`]
  if (parts.length) lines.push(parts.join(' '))
  if (detail && detail.features && detail.features.length) {
    lines.push('')
    lines.push('核心亮点：')
    detail.features.slice(0, 4).forEach((f) => lines.push(`· ${f.title}：${f.text}`))
  }
  if (detail && detail.techStack && detail.techStack.length) {
    lines.push('')
    lines.push(`技术栈：${detail.techStack.join(' / ')}`)
  }
  if (detail && detail.links) {
    const links = []
    if (detail.links.preview) links.push(`官网：${detail.links.preview}`)
    if (detail.links.github) links.push(`GitHub：${detail.links.github}`)
    if (links.length) lines.push(`\n${links.join('\n')}`)
  }
  return lines.join('\n')
}

/** 按分类拼装"有哪些作品"清单 */
function buildListAnswer() {
  const byCat = {}
  for (const w of WORK_METADATA) {
    const title = CATEGORY_STRUCTURE[w.category]?.title || '其他'
    if (!byCat[title]) byCat[title] = []
    byCat[title].push(w.title)
  }
  const lines = ['我主人的作品按分类如下：']
  for (const [title, works] of Object.entries(byCat)) {
    lines.push(`- **${title}**（${works.length}）：${works.join('、')}`)
  }
  lines.push('\n点击导航栏的 **Works** 就能浏览全部作品。')
  return lines.join('\n')
}

/**
 * 本地确定性解答入口：
 *  - 内容解答 + 命中已知作品 → 返回 { text }（正文输出，不进 LLM）
 *  - 有哪些作品 / 项目 → 返回 { text }（分类清单）
 *  - 其余 → 返回 null（交由 LLM）
 */
export function getLocalAnswer(msg) {
  if (!msg) return null
  if (isNavIntent(msg)) return null // 导航意图不在此解答，交给导航链路

  const m = norm(msg)
  if (isListIntent(msg)) return { text: buildListAnswer() }

  if (isInfoIntent(msg)) {
    const matched = matchWork(msg)
    if (matched) return { text: buildProjectAnswer(matched.work) }
  }
  return null
}
