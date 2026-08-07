/**
 * 作品专属详情内容注册表 — 为每个作品提供「概述 / 功能亮点 / 技术栈 / 图集」等富内容
 * 结构：id → { overview[], features[], techStack[], gallery[], links{}, stats[] }
 * 所有图片路径为相对 public/ 的路径，渲染时用 asset() 解析
 */

export const WORK_DETAILS = {
  // ============ AI · 云栖 ============
  'ai-aerie': {
    overview: [
      'Aerie · 云栖（v0.1.0-beta.1）是一款本地优先的 AI 桌面伴侣「伊塔」。它由 Electron 桌面壳 + Python 智能内核组成，通过 NapCat 接入 QQ，随时在 Windows 11 上待命——办公学习、情感陪伴、电脑操控、主动关怀，一个就够了。',
      '从 v9.0 起，伊塔完成了办公模式、双层回复校验、Auto-Wake 主动唤醒等核心能力的完整落地，并配套建设了 Spotlight 官网、系统设计文档与全套 e2e 验证体系。',
    ],
    features: [
      { icon: 'Monitor', title: '灵动岛 UI', text: '桌面灵动岛替换悬浮球，单击展开 380×480 聊天窗，侧边栏 5 Tab 管理情绪 / 纪念 / 系统 / 其他 / 数据。' },
      { icon: 'Briefcase', title: '办公模式', text: '7 大办公工具 + 豆包模型优先 + 设备识别 + 智能任务检测，覆盖文档写作与日常办公自动化。' },
      { icon: 'Shield', title: '双层回复校验', text: 'Accuracy Guard（准确合规）+ Quality Judge（质量情绪）双重把关，确保回复既准确又贴心。' },
      { icon: 'Heart', title: '情感引擎', text: 'PAD 三维模型 + 4 槽累积阈值系统，根据互动积累情绪状态并驱动主动关怀。' },
      { icon: 'Bell', title: 'Auto-Wake 主动唤醒', text: '9 类场景（早安 / 天气 / 午提醒 / 晚安 / 待办 / 纪念日 / 失联关怀 / 情绪安抚等）+ 每日 5 次频控。' },
      { icon: 'RefreshCw', title: '自进化 L4', text: '代码自修改 + 4 道安全闸门 + 24h 回滚，配合故障自愈 14 类与每日自动备份。' },
    ],
    techStack: ['Electron', 'Vue3', 'Python', 'aiohttp', 'NapCat', 'OneBot11', 'WebSocket', 'Qwen', 'DeepSeek', '豆包', 'MiniMax'],
    links: {
      github: 'https://github.com/Laser1209/Aerie-Yunqi',
      preview: 'https://laser1209.github.io/Aerie_Spotlight/',
    },
    stats: [
      { label: '版本', value: 'v0.1.0-beta.1' },
      { label: '主动唤醒场景', value: '9 类' },
      { label: '工具系统', value: '20+' },
      { label: '主题', value: '5+' },
    ],
  },

  // ============ AI · Braintoss ============
  'ai-braintoss': {
    overview: [
      'Braintoss · 不累吐 是一款面向知识工作者的 AI 灵感陪伴工具——随手投喂碎片化想法，AI 自动梳理为结构化思维导图，配套 AI 灵宠「米沫 Mimo」提供情感陪伴与洞察。',
      '采用 Web 原生 JS + Node/Express + MySQL 与移动端 H5 + Java Spring Boot 双端架构，DeepSeek 三 Key 隔离调度，支持 PDF / Word / Excel 多格式导出与四语 i18n。',
    ],
    features: [
      { icon: 'Zap', title: '随手投喂', text: '以极低门槛记录碎片化灵感，不让任何想法溜走。' },
      { icon: 'Network', title: '结构化思维导图', text: 'AI 自动将散乱想法梳理成清晰、可复用的结构化脑图。' },
      { icon: 'Sparkles', title: 'AI 灵宠米沫', text: '米沫 Mimo 提供情感陪伴与深层洞察，让工具更有温度。' },
      { icon: 'KeyRound', title: '三 Key 隔离调度', text: 'DeepSeek 多 Key 隔离调度，保障稳定与并发。' },
      { icon: 'FileDown', title: '多格式导出', text: '支持 PDF / Word / Excel 多格式导出，四语 i18n。' },
      { icon: 'Crown', title: '会员体系', text: '完整 L1 / L2 / L3 订阅会员体系，覆盖付费闭环。' },
    ],
    techStack: ['原生 JS', 'Node.js', 'Express', 'MySQL', 'Java', 'Spring Boot', 'DeepSeek', 'H5', 'i18n'],
    links: {},
  },

  // ============ AI · 非遗声境 ============
  'ai-ningsheng': {
    overview: [
      '非遗声境 以声音为媒介，打造非遗沉浸式在线教育平台——覆盖中国十大非遗门类，提供声景沉浸、体系课程、互动听音辨艺三大核心体验。',
      '基于 React 19 + TypeScript + Vite 构建，集成 Framer Motion 动效与 Zustand 状态管理，支持多音轨同时播放与 AI 视频生成。',
    ],
    features: [
      { icon: 'Volume2', title: '声景沉浸', text: '12 组声景音源，营造身临其境的文化氛围。' },
      { icon: 'BookOpen', title: '体系课程', text: '4 门课程覆盖十大非遗门类，体系化学习路径。' },
      { icon: 'Headphones', title: '互动听音辨艺', text: '听音辨艺互动体验，寓教于乐。' },
      { icon: 'Clapperboard', title: 'AI 视频生成', text: '接入 Seedance 实现 AI 视频内容生成。' },
    ],
    techStack: ['React 19', 'TypeScript', 'Vite', 'Framer Motion', 'Zustand', 'Seedance', '响应式'],
    links: {},
  },

  // ============ AI · 云审智联 ============
  'ai-yunshen': {
    overview: [
      '云审智联 · 建审智脑 是建筑工程全生命周期智能审计 SaaS 平台——以微信小程序为载体，集成 AI 智能对话、ESG 双碳合规审查、项目全过程管理、审计报告生成与风险预警等核心能力。',
      '前端采用微信小程序原生框架，后端基于 Spring Boot 2.7 + Java 17 + MySQL 8.0 + JPA/Hibernate，AI 层接入 MiniMax M2 大模型。',
    ],
    features: [
      { icon: 'MessageSquare', title: 'AI 智能对话', text: '接入 MiniMax M2，实现审计咨询与政策解读。' },
      { icon: 'Leaf', title: 'ESG 双碳合规', text: 'ESG 双碳合规审查能力，覆盖绿色审计场景。' },
      { icon: 'ClipboardList', title: '全过程管理', text: '覆盖建筑项目五阶段审计流程的全过程管理。' },
      { icon: 'FileText', title: '审计报告生成', text: '自动生成审计报告与风险预警，提升效率。' },
    ],
    techStack: ['微信小程序', 'Spring Boot', 'Java 17', 'MySQL 8.0', 'JPA/Hibernate', 'MiniMax M2'],
    links: {},
  },

  // ============ AI · 青银智链 ============
  'ai-qingyin': {
    overview: [
      '青银智链 是高校-社区-商家三圈联动智慧助老平台——面向长者、子女、志愿者、社区网格员、商户五类角色的 uni-app x 跨端小程序。',
      '基于 Vue 3 Composition API + UTS 语言构建，支持关怀模式大字版、WeChat 一键登录，以积分 + 现金混合支付串联三圈生态。',
    ],
    features: [
      { icon: 'Siren', title: '一键 SOS 呼救', text: '长者安全核心能力，一键紧急呼救。' },
      { icon: 'Activity', title: '毫米波健康监测', text: '非接触毫米波健康监测，关爱长者健康。' },
      { icon: 'Clock', title: '时间银行', text: '志愿者时间银行积分体系，激励互助。' },
      { icon: 'Truck', title: '应急调度', text: '社区应急调度与工单管理，闭环响应。' },
    ],
    techStack: ['uni-app x', 'Vue 3', 'UTS', '微信小程序', '时间银行'],
    links: {},
  },

  // ============ AI · 急救先锋 ============
  'ai-jijiu': {
    overview: [
      '急救先锋 · 无人机应急管理平台 是智能无人机集群应急救援方案——融合低空经济与应急产业，提出模块化无人机集群协同救援概念。',
      '方案涵盖 20 类救援模块、集群协同算法、强韧性通信系统、极端环境验证，覆盖自然灾害、工业事故、智慧城市、能源巡检、大型活动安保等场景，并形成展览级展板与完整提案体系。',
    ],
    features: [
      { icon: 'Rocket', title: '模块化无人机集群', text: '20 类救援模块，可快速组合应对不同灾情。' },
      { icon: 'GitMerge', title: '集群协同算法', text: '多机协同调度，提升救援效率与覆盖。' },
      { icon: 'Radio', title: '强韧性通信', text: '强韧性通信系统，保障极端环境连接。' },
      { icon: 'Map', title: '多场景覆盖', text: '自然灾害 / 工业事故 / 智慧城市 / 能源巡检等。' },
    ],
    techStack: ['无人机集群', '低空经济', '智能调度', '方案设计', '产品概念'],
    links: {},
  },

  // ============ UI · 海岱文博 ============
  'ui-haidai': {
    overview: [
      '海岱文博 · 山东博物馆 是山东博物馆官方数字文博 App 全案 UI/UX 设计——以「探索齐鲁文化珍宝的数字钥匙」为核心理念，覆盖文物数字展厅、虚拟助手「玉灵灵」AI 导览、每日文物卡片、成就系统、参观预约与场馆导航等完整功能模块。',
      '设计输出包含 Adobe XD 高保真交互原型、14 页用户使用手册、宣传海报与演示视频，覆盖从产品定义、交互流程到视觉规范的完整链路。',
    ],
    features: [
      { icon: 'Landmark', title: '文物数字展厅', text: '沉浸式浏览齐鲁文物珍宝。' },
      { icon: 'Bot', title: '虚拟助手玉灵灵', text: 'AI 导览助手，陪伴讲解。' },
      { icon: 'CreditCard', title: '每日文物卡片', text: '每日一张文物卡片，养成文化习惯。' },
      { icon: 'Trophy', title: '成就系统', text: '互动成就激励，提升黏性。' },
    ],
    techStack: ['Adobe XD', 'UI/UX 设计', '交互原型', '视觉规范', '博物馆 App'],
    links: {},
  },

  // ============ 海报设计 ============
  'poster-6': {
    overview: ['以手造物 是一幅手工艺主题的视觉设计海报，聚焦传统手作的温度与匠心。'],
    features: [
      { icon: 'Palette', title: '手工艺主题', text: '以手造物的匠人精神为核心视觉表达。' },
      { icon: 'PenTool', title: '版式设计', text: '简洁有力的构图与信息层级。' },
    ],
    techStack: ['Photoshop', '海报设计'],
    links: {},
  },
  'poster-7': {
    overview: ['以手造物 以文传心 是一幅文创主题海报，将手作的温度与文化的传递融合表达。'],
    features: [
      { icon: 'Palette', title: '文创主题', text: '手作 × 文化的双重叙事。' },
      { icon: 'Feather', title: '以文传心', text: '通过设计与文字传递文化情感。' },
    ],
    techStack: ['Photoshop', '文创设计', '海报设计'],
    links: {},
  },
  'poster-8': {
    overview: ['墨缘音乐协会 是一幅音乐协会活动展板（KT 板）设计，面向校园演出与社团宣传场景。'],
    features: [
      { icon: 'Music', title: '音乐社团视觉', text: '契合音乐协会气质的活动展板。' },
      { icon: 'Frame', title: 'KT 板规格', text: '面向实际印刷与展示的活动物料。' },
    ],
    techStack: ['Photoshop', '展板设计', '活动物料'],
    links: {},
  },
  'poster-1': {
    overview: ['Minimalist CC Brand Website 是一幅极简主义品牌官网重设计作品，探索克制、高级的网页视觉语言。'],
    features: [
      { icon: 'Globe', title: '品牌官网重设计', text: '在保持品牌识别的同时进行极简重构。' },
      { icon: 'Minimize2', title: '极简主义', text: '留白、克制、聚焦内容本质。' },
    ],
    techStack: ['品牌设计', '网页视觉', '极简主义'],
    links: {},
  },
  'poster-9': {
    overview: ['古风博物馆展览海报 是一幅中式人文博物馆黄褐色古风展览海报，融合传统美学与人文气息。'],
    features: [
      { icon: 'Landmark', title: '古风人文', text: '黄褐色古风色调，中式人文气质。' },
      { icon: 'Brush', title: '传统美学', text: '传统纹样与版面语言的现代演绎。' },
    ],
    techStack: ['Photoshop', '古风海报', '博物馆展览'],
    links: {},
  },

  // ============ 交互 · QQ音乐 ============
  'page-1': {
    overview: [
      'QQ音乐 PC 端完整首页复刻——包含头部导航、搜索框、轮播歌单推荐、新歌首发、排行榜、MV、底部导航等完整功能模块。',
      '以原生 HTML/CSS/JavaScript 从零搭建，还原真实产品级的页面结构与交互细节。',
    ],
    features: [
      { icon: 'Search', title: '搜索框', text: '顶部搜索，还原真实检索体验。' },
      { icon: 'LayoutGrid', title: '轮播歌单推荐', text: '首页轮播推荐歌单，视觉焦点区。' },
      { icon: 'TrendingUp', title: '新歌首发与排行榜', text: '新歌首发、排行榜等运营板块。' },
      { icon: 'Clapperboard', title: 'MV 与底部导航', text: 'MV 专区与完整底部导航体系。' },
    ],
    techStack: ['HTML', 'CSS', 'JavaScript'],
    links: {},
  },

  // ============ 视频 · AIGC ============
  'aigc-1': {
    overview: ['Each Rich（逐富）是一部 AIGC 风格化短片，通过 AI 生成与创意剪辑完成富有风格的影像表达。'],
    features: [
      { icon: 'Clapperboard', title: 'AIGC 短片', text: 'AI 生成 + 风格化后期。' },
      { icon: 'Workflow', title: '工作流沉淀', text: '沉淀可复用的 AIGC 创作工作流。' },
    ],
    techStack: ['AIGC', '视频剪辑', '风格化'],
    links: {},
  },
  'aigc-2': {
    overview: ['替我去看世界 是一部 AIGC 叙事短片——「替我活下去的她」，用 AI 影像讲述一段带着思念看世界的旅程。'],
    features: [
      { icon: 'Clapperboard', title: '叙事短片', text: '以叙事驱动的情感影像。' },
      { icon: 'Film', title: 'AI 影像', text: 'AI 生成画面与情绪氛围营造。' },
    ],
    techStack: ['AIGC', '叙事短片', '视频剪辑'],
    links: {},
  },

  // ============ 三维建模 ============
  '3d-1': {
    overview: ['游戏角色-斯卡蒂 是《明日方舟》角色「斯卡蒂」的三维建模作品，包含角色模型、材质与渲染样图。'],
    features: [
      { icon: 'Box', title: '角色建模', text: '还原斯卡蒂角色造型与特征。' },
      { icon: 'Sun', title: '渲染输出', text: '多角度渲染样图与细节表现。' },
    ],
    techStack: ['三维建模', '角色设计', '渲染'],
    links: {},
  },

  // ============ 软件 · 手势鼠标 ============
  'dev-gesture-mouse': {
    overview: [
      'GestureMouse 手势控制电脑 用安卓手机摄像头识别手势、通过 USB 远程控制电脑鼠标的开源方案。纯本地零云端，数据不出设备。',
      '架构：手机 USB 推视频流 → PC 推理 → PC 控制 + 回传关键点 → 手机渲染 21 点骨骼 Overlay。Android 端（Camera2 + MediaCodec H.264 硬编）+ Python 端（MediaPipe + PyAV + PyQt6 + pynput）。',
    ],
    features: [
      { icon: 'MousePointer', title: 'fingertip 手势判定', text: '基于关节几何的指尖伸直判定（MCP-PIP-DIP 夹角 > 125°），3 帧确认防误触。' },
      { icon: 'Scroll', title: '单指弯曲控制', text: '无名指弯曲持续下滚、小拇指弯曲上滚、中指弯曲单击右键。' },
      { icon: 'Target', title: '四边形控制区 + 吸附点击', text: '自定义四边形控制区 + 磁铁网格 + 停留 0.6s 自动左键，解决「瞄不准」。' },
      { icon: 'Moon', title: '夜间视觉增强', text: '自适应 gamma + CLAHE 低光增强，提升暗光识别率。' },
      { icon: 'Monitor', title: 'DPI 感知', text: 'PerMonitorV2 DPI 感知，杜绝缩放导致的光标偏移。' },
      { icon: 'Smartphone', title: '双通道低延迟', text: 'ADB reverse 双通道 + TCP_NODELAY，心跳 1s 自动重连。' },
    ],
    techStack: ['Android', 'Kotlin', 'Camera2', 'MediaCodec H.264', 'Python', 'MediaPipe', 'PyAV', 'PyQt6', 'pynput', 'ADB', 'USB'],
    links: {
      github: 'https://github.com/Laser1209/GestureMouse',
    },
    stats: [
      { label: '类型', value: '软件 / 自研' },
      { label: '数据', value: '纯本地' },
      { label: '端', value: 'Android + PC' },
    ],
  },

  // ============ 隐藏小游戏（彩蛋页专属） ============
  'game-1': {
    overview: ['经典贪吃蛇游戏实现——控制蛇的移动方向，吃掉食物增长身体，避免撞到墙壁或自己的身体。'],
    features: [
      { icon: 'Gamepad2', title: '操作方式', text: '方向键或 WASD 控制移动。' },
      { icon: 'Apple', title: '游戏目标', text: '吃食物增长，每吃一个蛇身加长。' },
      { icon: 'ChartLine', title: '计分系统', text: '每吃一个食物 +10 分，难度随得分提升。' },
    ],
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'Canvas API'],
    links: {},
  },
  'game-2': {
    overview: ['双人对战五子棋游戏实现——黑白双方轮流落子，先连成五子者获胜。'],
    features: [
      { icon: 'Users', title: '双人对战', text: '同屏双人对弈，轮流落子。' },
      { icon: 'Award', title: '胜负判定', text: '横、竖、斜任意方向连五即胜。' },
    ],
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'Canvas API'],
    links: {},
  },
  'game-3': {
    overview: ['经典扫雷游戏实现——翻开格子、避开地雷，通过数字推理找出所有安全格。'],
    features: [
      { icon: 'Bomb', title: '扫雷规则', text: '数字提示周边地雷数，规避雷区。' },
      { icon: 'Flag', title: '标记地雷', text: '右键标记疑似地雷，辅助推理。' },
    ],
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'Canvas API'],
    links: {},
  },
  'game-4': {
    overview: ['蜘蛛纸牌游戏实现——将同花色牌按降序排列移入基座，逐步清空桌面。'],
    features: [
      { icon: 'Layers', title: '同花顺移牌', text: '将 K 到 A 同花色按序移动。' },
      { icon: 'Undo2', title: '策略玩法', text: '规划移动，合理利用空列。' },
    ],
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'Canvas API'],
    links: {},
  },
  'game-5': {
    overview: ['跳一跳游戏实现——蓄力跳跃于方块之间，保持平衡并不断前进。'],
    features: [
      { icon: 'MoveVertical', title: '蓄力跳跃', text: '长按蓄力，松手跳跃。' },
      { icon: 'StepForward', title: '连续闯关', text: '跳跃方块累积得分，考验节奏。' },
    ],
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'Canvas API'],
    links: {},
  },
  'game-6': {
    overview: ['经典魂斗罗游戏复刻——横版动作射击，还原跑跳射击的核心玩法。'],
    features: [
      { icon: 'Crosshair', title: '动作射击', text: '跑、跳、射击结合的经典玩法。' },
      { icon: 'Zap', title: '关卡挑战', text: '多关卡横版闯关体验。' },
    ],
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'Canvas API'],
    links: {},
  },
}
