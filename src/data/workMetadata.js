/**
 * 作品元数据注册表 — 人工维护的标题、描述、分类等信息
 */

export const WORK_METADATA = [
  // ===== 人工智能开发（置顶） =====
  {
    id: 'ai-aerie',
    title: 'Aerie · 云栖',
    description: '本地优先的 AI 桌面伴侣「伊塔」——Electron + Python 多模型调度，灵动岛 UI、情感引擎 PAD 模型、主动关怀推送、QQ Bot 接入、电脑操控、文件智能整理、20+ 工具系统、自进化 L4、5+ 主题。支持 Qwen/DeepSeek/豆包/MiniMax/Gemini 多 Provider，Windows 10/11 桌面端，Android 原生端开发中。',
    category: 'aiDev',
    subcategory: 'desktop',
    thumbnail: 'img/aerie-preview.svg',
    previewUrl: 'https://laser1209.github.io/Aerie_Spotlight/',
    externalLink: 'https://github.com/Laser1209/Aerie-Yunqi',
    isExternal: true,
    tags: ['Electron', 'Python', 'AI Agent', 'LLM', '桌面应用'],
  },
  {
    id: 'ai-braintoss',
    title: 'Braintoss · 不累吐',
    description: '面向知识工作者的 AI 灵感陪伴工具——随手投喂碎片化想法，AI 自动梳理为结构化思维导图，配套 AI 灵宠「米沫 Mimo」提供情感陪伴与洞察。Web 端原生 JS + Node/Express + MySQL，移动端 H5 + Java Spring Boot 双端架构，DeepSeek 三 Key 隔离调度，支持 PDF/Word/Excel 多格式导出、四语 i18n、完整会员订阅体系 L1/L2/L3。',
    category: 'aiDev',
    subcategory: 'webapp',
    thumbnail: 'img/braintoss-mimo.png',
    previewUrl: '',
    externalLink: '',
    isExternal: true,
    tags: ['AI Agent', 'Node.js', 'Express', 'MySQL', 'Spring Boot', '全栈'],
    gallery: [
      'img/braintoss-mobile-home.png',
      'img/braintoss-mobile-mindmap.png',
      'img/braintoss-current.png',
    ],
  },

  // ===== 平面设计 → 海报设计 =====
  {
    id: 'poster-6',
    title: '以手造物',
    description: '手工艺主题视觉设计',
    category: 'graphicDesign',
    subcategory: 'posterDesign',
    thumbnail: 'img/以手造物.png',
  },
  {
    id: 'poster-7',
    title: '以手造物 以文传心',
    description: '文创主题海报设计',
    category: 'graphicDesign',
    subcategory: 'posterDesign',
    thumbnail: 'img/以手造物 以文传心.png',
  },
  {
    id: 'poster-8',
    title: '墨缘音乐协会',
    description: '音乐协会活动展板设计',
    category: 'graphicDesign',
    subcategory: 'posterDesign',
    thumbnail: 'img/墨缘音乐协会-KT板.png',
  },
  {
    id: 'poster-1',
    title: 'Minimalist CC Brand Website',
    description: '极简主义品牌官网重设计',
    category: 'graphicDesign',
    subcategory: 'posterDesign',
    thumbnail: 'img/Restyled Page Minimalist CC Brand Website.png',
  },
  {
    id: 'poster-9',
    title: '古风博物馆展览海报',
    description: '中式人文博物馆黄褐色古风展览海报',
    category: 'graphicDesign',
    subcategory: 'posterDesign',
    thumbnail: 'img/黄褐色古风中式人文博物馆展览海报.pdf',
  },

  // ===== 平面设计 → 页面设计 =====
  {
    id: 'page-1',
    title: 'QQ音乐',
    description: '仿QQ音乐PC端完整首页，包含头部导航、搜索框、轮播歌单推荐、新歌首发、排行榜、MV、底部导航等完整功能模块',
    category: 'graphicDesign',
    subcategory: 'pageDesign',
    thumbnail: 'img/qq-music-preview.svg',
    externalLink: 'program/qq-music.html',
  },

  // ===== 视频剪辑 → AIGC =====
  {
    id: 'aigc-1',
    title: 'Each Rich',
    description: 'AIGC风格化短片 - 逐富',
    category: 'videoEditing',
    subcategory: 'aigc',
    thumbnail: 'img/工作流-each-rich.png',
    externalLink: 'video/Each_Rich.mp4',
  },
  {
    id: 'aigc-2',
    title: '替我去看世界',
    description: 'AIGC叙事短片 - 替我活下去的她',
    category: 'videoEditing',
    subcategory: 'aigc',
    externalLink: 'video/go-see-world.mp4',
  },

  // ===== 三维建模 =====
  {
    id: '3d-1',
    title: '游戏角色-斯卡蒂',
    description: '明日方舟·斯卡蒂 角色三维建模',
    category: 'modeling3d',
    thumbnail: 'img/skadi-render.png',
  },

  // ===== 基础逻辑书写 → 小游戏 =====
  {
    id: 'game-1',
    title: '贪吃蛇',
    description: '经典贪吃蛇游戏实现',
    category: 'basicLogic',
    thumbnail: 'img/snake-preview.svg',
    externalLink: 'program/snake.html',
  },
  {
    id: 'game-2',
    title: '五子棋',
    description: '双人对战五子棋游戏',
    category: 'basicLogic',
    thumbnail: 'img/gobang-preview.svg',
    externalLink: 'program/gobang.html',
  },
  {
    id: 'game-3',
    title: '扫雷',
    description: '经典扫雷游戏实现',
    category: 'basicLogic',
    thumbnail: 'img/minesweeper-preview.svg',
    externalLink: 'program/minesweeper.html',
  },
  {
    id: 'game-4',
    title: '蜘蛛纸牌',
    description: '蜘蛛纸牌游戏实现',
    category: 'basicLogic',
    thumbnail: 'img/spider-preview.svg',
    externalLink: 'program/spider-solitaire.html',
  },
  {
    id: 'game-5',
    title: '跳一跳',
    description: '跳一跳游戏实现',
    category: 'basicLogic',
    thumbnail: 'img/threeKills-preview.svg',
    externalLink: 'program/threeKills.html',
  },
  {
    id: 'game-6',
    title: '魂斗罗',
    description: '经典魂斗罗游戏复刻',
    category: 'basicLogic',
    thumbnail: 'img/contra-preview.svg',
    externalLink: 'program/contra.html',
  },
]

// 分类结构定义 — AI 开发置顶
export const CATEGORY_STRUCTURE = {
  aiDev: {
    title: '人工智能开发',
    categories: {
      desktop: { title: '桌面应用' },
      webapp: { title: 'Web 应用' },
    },
  },
  graphicDesign: {
    title: '平面设计',
    categories: {
      posterDesign: { title: '海报设计' },
      pageDesign: { title: '页面设计' },
    },
  },
  videoEditing: {
    title: '视频剪辑',
    categories: {
      aigc: { title: 'AIGC' },
    },
  },
  modeling3d: {
    title: '三维建模',
  },
  basicLogic: {
    title: '基础逻辑书写',
  },
}
