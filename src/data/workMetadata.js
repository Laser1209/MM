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
  {
    id: 'ai-ningsheng',
    title: '非遗声境',
    description: '以声音为媒介的非遗沉浸式在线教育平台——覆盖中国十大非遗门类，提供声景沉浸、体系课程、互动听音辨艺三大核心体验。基于 React 19 + TypeScript + Vite 构建，集成 Framer Motion 动效与 Zustand 状态管理，支持多音轨同时播放、AI 视频生成（Seedance），包含 10 项非遗内容、4 门课程、12 组声景音源。全栈前端 SPA，响应式设计，中文文化主题配色体系。',
    category: 'aiDev',
    subcategory: 'webapp',
    thumbnail: 'img/ningyun-preview.png',
    previewUrl: '',
    externalLink: '',
    isExternal: true,
    tags: ['React 19', 'TypeScript', 'Vite', 'Framer Motion', 'Zustand', 'AI 视频生成', '非遗教育'],
  },
  {
    id: 'ai-yunshen',
    title: '云审智联 · 建审智脑',
    description: '建筑工程全生命周期智能审计 SaaS 平台——以微信小程序为载体，集成 AI 智能对话、ESG 双碳合规审查、项目全过程管理、审计报告生成与风险预警等核心能力。前端采用微信小程序原生框架，后端基于 Spring Boot 2.7 + Java 17 + MySQL 8.0 + JPA/Hibernate，AI 层接入 MiniMax M2 大模型实现审计咨询与政策解读。覆盖建筑项目五阶段审计流程，支持会员订阅体系，具备完整的用户认证、文件管理与数据持久化能力。',
    category: 'aiDev',
    subcategory: 'webapp',
    thumbnail: 'img/yunshen-preview.jpg',
    previewUrl: '',
    externalLink: '',
    isExternal: true,
    tags: ['微信小程序', 'Spring Boot', 'Java', 'MySQL', 'AI Agent', 'MiniMax', 'ESG', '建筑工程审计'],
  },
  {
    id: 'ai-qingyin',
    title: '青银智链',
    description: '高校-社区-商家三圈联动智慧助老平台——面向长者、子女、志愿者、社区网格员、商户五类角色的 uni-app x 跨端小程序。核心功能涵盖长者一键 SOS 呼救、毫米波健康监测、志愿者时间银行积分体系、社区应急调度与工单管理、商户积分核销等。基于 Vue 3 Composition API + UTS 语言构建，支持关怀模式大字版、WeChat 一键登录，以积分+现金混合支付串联三圈生态。数据层采用 mock 模拟完整业务闭环，可快速对接后端。',
    category: 'aiDev',
    subcategory: 'webapp',
    thumbnail: 'img/qingyin-preview.png',
    previewUrl: '',
    externalLink: '',
    isExternal: true,
    tags: ['uni-app x', 'Vue 3', 'UTS', '微信小程序', '养老服务', '时间银行', '多角色系统'],
  },
  {
    id: 'ai-jijiu',
    title: '急救先锋 · 无人机应急管理平台',
    description: '智能无人机集群应急救援方案——融合低空经济与应急产业，提出模块化无人机集群协同救援概念。方案涵盖 20 类救援模块、集群协同算法、强韧性通信系统、极端环境验证等核心设计，覆盖自然灾害、工业事故、智慧城市、能源巡检、大型活动安保等多场景。已完成完整的发展前景分析：市场规模预测、核心竞争力评估、分阶段发展规划（1-3 年 / 3-5 年 / 5 年以上）、组织架构与成本对比。项目以展览级展板、流程图、分析报告与视觉素材构成完整提案体系。',
    category: 'aiDev',
    subcategory: 'concept',
    thumbnail: 'img/jijiu-preview.jpg',
    previewUrl: '',
    externalLink: '',
    isExternal: true,
    tags: ['无人机集群', '应急救援', '低空经济', '智能调度', '方案设计', '产品概念'],
  },

  // ===== 平面设计 → UI/UX 设计 =====
  {
    id: 'ui-haidai',
    title: '海岱文博 · 山东博物馆',
    description: '山东博物馆官方数字文博 App 全案 UI/UX 设计——以"探索齐鲁文化珍宝的数字钥匙"为核心理念，覆盖文物数字展厅、虚拟助手「玉灵灵」AI 导览、每日文物卡片、成就系统、参观预约与场馆导航等完整功能模块。设计输出包含 Adobe XD 高保真交互原型、14 页用户使用手册、宣传海报与演示视频，支持多语言导览、个性化推荐与离线浏览。全套设计交付物覆盖从产品定义、交互流程到视觉规范的完整链路。',
    category: 'graphicDesign',
    subcategory: 'uiDesign',
    thumbnail: 'img/haidai-preview.png',
    previewUrl: '',
    externalLink: '',
    isExternal: true,
    tags: ['UI/UX 设计', 'Adobe XD', '博物馆 App', '交互原型', '数字文博', '视觉规范'],
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
      concept: { title: '概念方案' },
    },
  },
  graphicDesign: {
    title: '平面设计',
    categories: {
      posterDesign: { title: '海报设计' },
      pageDesign: { title: '页面设计' },
      uiDesign: { title: 'UI/UX 设计' },
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
