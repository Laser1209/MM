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
  email: 'etta120913@gmail.com',
  github: 'https://github.com/Laser1209',
  githubLabel: 'Laser1209',
  wechatQR: asset('img/QR.png'),
  logo: asset('img/Etta.png'),
  tagline: 'Coding globally from China. Available for freelance work',
  // Navigation status messages for marquee
  navMessages: [
    'Deploying Works — Not Broken',
    'Loading Portfolio — Works Updating',
    'Aerie · 云栖 — AI Desktop Companion',
    'Braintoss 不累吐 — AI 灵感陪伴',
    'AI Agent Development — Vibe Coding',
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
    { label: '怎么联系合作？', query: '怎么联系你合作？' },
  ],
  // About me text
  aboutText:
    '从平面设计到前端开发，我走的是一条融合学科的跨界之路。始于对视觉美学的热爱，在 Photoshop、Figma 与即时设计中探索海报设计、专辑封面和品牌视觉，在 After Effects 与 Premiere 里探寻特效与影音的奥秘；而后被代码的创造力吸引，从 HTML/CSS 起步，逐步掌握 JavaScript、Canvas API 与 animation.js，进而深入 Node.js 服务端开发，并用 Remotion 探索视频编程创意，再基于 TypeScript 拓展至鸿蒙生态，运用 ArkTS 搭建 ArkUI 应用。期间，我主导或参与了宠物商城社区一站式管理平台等多个比赛项目，积累了扎实的全栈实战经验。\n\n而现在，我拥抱 Vibe Coding，借助国内的 Trae，以及 Codex、Claude Code、ChatGPT 等国外工具，打造了 Aerie · 云栖、Braintoss 不累吐等多款产品，积累了丰富的人工智能开发经验。我对 AI Agent 体系开发、视觉识别及人工智能心理模拟，已形成较深的理解与架构搭建能力。\n\n每一行代码都是成长的印记，每一个项目都是热爱的证明——我相信，好的设计需要技术来落地，好的技术需要审美来点亮。',
  // Skills data (4 bars, ordered by strength)
  skills: [
    { name: 'AI 产品开发', value: 82 },
    { name: '全栈工程', value: 68 },
    { name: '设计美学', value: 90 },
    { name: '创意探索', value: 55 },
  ],
  // Works preview categories (home page) — AI first
  workCategories: [
    { id: 'aiDev', title: '人工智能开发', subtitle: 'AI Agent / 桌面伴侣 / 产品架构', icon: 'brain' },
    { id: 'graphicDesign', title: '平面设计', subtitle: '海报设计 / 页面设计', icon: 'palette' },
    { id: 'videoEditing', title: '视频剪辑', subtitle: 'AIGC', icon: 'video' },
    { id: 'modeling3d', title: '三维建模', subtitle: '场景建模 / 产品展示', icon: 'cube' },
    { id: 'basicLogic', title: '基础逻辑书写', subtitle: '小游戏开发 / 逻辑实现', icon: 'code' },
  ],
}
