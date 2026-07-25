// Base URL for public assets (Vite handles dev/prod resolution)
const BASE = import.meta.env.BASE_URL || '/'

// Helper: resolve a public asset path relative to the base URL
export function asset(path) {
  const clean = path.replace(/^\//, '')
  return `${BASE}${clean}`
}

// Site-wide configuration
export const SITE_CONFIG = {
  brand: 'Etta',
  name: 'Laser',
  email: 'etta120913@gmail.com',
  phone: '190******70',
  github: 'https://github.com/Laser1209',
  githubLabel: 'Laser1209',
  location: '济南',
  wechatQR: asset('img/QR.png'),
  logo: asset('img/Etta.png'),
  tagline: '全栈开发者 · AI 产品构建者 · 跨界创意人 — 山东管理学院 网络与新媒体',
  // Navigation status messages for marquee
  navMessages: [
    'Deploying Works — Not Broken',
    'Loading Portfolio — Works Updating',
    'Aerie · 云栖 — AI Desktop Companion v9.0',
    'Braintoss 不累吐 — AI 灵感陪伴灵宠米沫',
    '云审智脑 — 建筑工程智能审计系统',
    '齐物灵境 — AR+方言淄博文旅平台',
    'AI Agent Development — Vibe Coding',
    '7项省级及以上专业奖项',
    'QQ Music Interface — Page Design',
    'Mini Games Collection — Interactive',
  ],
  // Intro scene video (Prompt A)
  introVideo: 'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8',
  // AI suggestions
  aiSuggestions: [
    { label: '有哪些作品？', query: '有哪些作品可以看？' },
    { label: 'Aerie 云栖是什么？', query: 'Aerie · 云栖是什么项目？' },
    { label: 'Braintoss 不累吐？', query: 'Braintoss 不累吐是什么？' },
    { label: '获得过什么奖项？', query: '你获得过哪些奖项和荣誉？' },
    { label: '技术栈是什么？', query: '你的技术栈有哪些？' },
    { label: '怎么联系合作？', query: '怎么联系你合作？' },
  ],
  // About me text
  aboutText:
    '我是 Laser，一名 20 岁的跨界创作者，目前就读于山东管理学院网络与新媒体专业。从视觉美学出发，我在 Photoshop、Illustrator、Figma、Axure 中打磨海报设计、品牌视觉与交互原型；而后被代码的创造力深深吸引，从 HTML/CSS/JavaScript 起步，逐步精通 TypeScript，熟练掌握 Vue.js、React 等主流前端框架，拓展至 Node.js、Python、Java 后端开发，熟悉 Spring Boot、MySQL、JWT 认证、Docker 容器化部署，形成完整的全栈工程能力。\n\n我深度拥抱 Vibe Coding 与人工智能开发浪潮，独立主导了 Aerie · 云栖（Electron+Vue3+Python 桌面 AI 伴侣）、Braintoss · 不累吐（AI 灵感陪伴工具）、云审智脑（建筑工程智能审计系统，微信小程序+Spring Boot）、齐物灵境（AR+方言淄博文旅平台，省大创立项）等 7 个完整项目的从 0 到 1 全链路落地，覆盖工具类、企业服务类、文旅创新类多个赛道，积累了 Electron 跨端开发、LLM API 对接、WebSocket 实时通信、AI Agent 架构搭建等核心技术实践。\n\n我累计获得 7 项省级及以上专业奖项，包括未来设计师·全国高校数字艺术设计大赛国家级三等奖、山东省"好创意"设计大赛一等奖、市级技术竞赛一等奖等。我相信，好的设计需要技术来落地，好的技术需要审美来点亮——从需求分析、交互设计、视觉输出到前后端开发，每一行代码都是成长的印记，每一个项目都是热爱的证明。',
  // Skills data (4 bars, ordered by strength)
  skills: [
    { name: 'AI 产品与全栈开发', value: 88 },
    { name: 'UI/UX 与视觉设计', value: 92 },
    { name: '前端工程化', value: 85 },
    { name: '跨领域快速学习', value: 90 },
  ],
  // Education
  education: {
    school: '山东管理学院',
    major: '网络与新媒体',
    degree: '本科',
    period: '2024.09 - 至今',
    graduation: '2028',
  },
  // Awards
  awards: [
    '未来设计师·全国高校数字艺术设计大赛 国家级三等奖',
    '省级大学生创新创业训练计划 立项',
    '山东省"好创意"设计大赛 一等奖',
    '市级技术竞赛 一等奖',
    '累计 7 项省级及以上专业类奖项',
  ],
  // Works preview categories (home page) — AI first
  workCategories: [
    { id: 'aiDev', title: '人工智能开发', subtitle: 'AI Agent / 桌面伴侣 / 全栈应用', icon: 'brain' },
    { id: 'graphicDesign', title: '设计美学', subtitle: 'UI/UX / 海报设计 / 品牌视觉', icon: 'palette' },
    { id: 'videoEditing', title: '视频创作', subtitle: 'AIGC / 创意剪辑', icon: 'video' },
    { id: 'modeling3d', title: '三维建模', subtitle: '角色渲染 / 场景设计', icon: 'cube' },
    { id: 'basicLogic', title: '交互开发', subtitle: '小游戏 / 创意编程', icon: 'code' },
  ],
}
