/**
 * 当前位置上下文 — 让 AI 知道自己此刻所在的页面
 *
 * 纯函数、无依赖，便于独立单测。AIChatPanel 通过 useLocation 获取当前路由后
 * 传给 aiEngine，aiEngine 在每次请求时把它作为 system 消息注入，
 * 使模型能回答"这是哪里 / 现在在哪 / 这是什么页面"等提问。
 */

// 由路由 pathname 描述用户当前所在页面（返回自然的页面名短语）
export function describeLocation(pathname) {
  const p = String(pathname || '/')
  if (p === '/' || p === '') return '作品集首页'
  if (p === '/works') return '作品总览页'
  if (p.startsWith('/works/')) return '某个作品的详情介绍页'
  if (p === '/easter-egg') return '彩蛋页（隐藏游戏库）'
  return '网站内的一个页面'
}

// 构造注入给模型的"当前所在位置"系统消息内容
export function buildLocationContext(pathname) {
  return (
    '【当前所在位置】访客此刻正位于「' +
    describeLocation(pathname) +
    '」。当访客询问"这是哪里""现在在哪""这是什么页面"等问题时，直接告诉访客他现在所在的位置即可，语气保持 Etta 的人设。注意：不要因此主动透露隐藏游戏库的具体游戏名单或解锁方式。'
  )
}
