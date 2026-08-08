/**
 * 当前位置上下文 — 让 AI 知道自己此刻所在的页面
 *
 * 无依赖纯函数，便于独立单测。AIChatPanel 通过 useLocation 获取当前路由后传给
 * aiEngine；aiEngine 解析出当前所在作品（若有）后一并传入，
 * 在每次请求时作为 system 消息注入，使模型能回答"这是哪里 / 现在在哪 /
 * 这是什么页面"等提问，并能针对当前所在作品页面的内容进行介绍。
 */

// 从 /works/:id 路径中解析出作品 id；非详情页返回 null
export function workIdFromPath(pathname) {
  const m = String(pathname || '').match(/^\/works\/([^/?]+)/)
  return m ? decodeURIComponent(m[1]) : null
}

// 由路由 pathname 描述用户当前所在页面（返回自然的页面名短语）。
// work 为可选参数：详情页时若已解析出当前作品，则显示具体作品名。
export function describeLocation(pathname, work = null) {
  const p = String(pathname || '/')
  if (p === '/' || p === '') return '作品集首页'
  if (p === '/works') return '作品总览页'
  if (p === '/easter-egg') return '彩蛋页（隐藏游戏库）'
  if (workIdFromPath(p)) return work ? `「${work.title}」的详情介绍页` : '某个作品的详情介绍页'
  return '网站内的一个页面'
}

// 构造注入给模型的"当前所在位置"系统消息内容。work 为可选参数，
// 详情页时若传入已解析的当前作品，则附上其简介供 AI 针对内容讲解。
export function buildLocationContext(pathname, work = null) {
  const workInfo = work
    ? `\n【当前作品信息】访客正在浏览的正是作品「${work.title}」。简介：${work.description || ''}`
    : ''
  return (
    '【当前所在位置】访客此刻正位于「' +
    describeLocation(pathname, work) +
    '」。当访客询问"这是哪里""现在在哪""这是什么页面""这个项目/当前项目/这里是什么"等问题时，直接针对当前页面内容回答。' +
    '注意：不要因此主动透露隐藏游戏库的具体游戏名单或解锁方式。' +
    workInfo
  )
}

