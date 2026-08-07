/**
 * 界面清单 — 系统内所有"可被 AI 调出"的目的地注册表
 *
 * 作用：
 *  1. 作为 AI 的"界面地图"：告诉模型系统里有哪些界面、各自描述、标签
 *  2. 作为程序侧"执行跳转"的权威依据：AI 只输出标准 id，程序据此查真实 route
 *
 * 分类组织：
 *  - 静态界面：首页分区、作品总览、分类页、彩蛋页
 *  - 作品界面：由 worksData 自动生成（避免重复维护）
 *
 * 数据来源：worksData + 手工定义的静态目的地
 */

import { asset } from '../config/siteConfig.js'
import { getAllWorks } from './worksData.js'

// ===== 首页分区 / 功能页等静态目的地 =====
const STATIC_INTERFACES = [
  {
    id: 'home',
    title: '首页',
    description: '作品集首页，包含入场动画、关于我、代表作品预览与核心技能',
    tags: ['首页', '入口', 'home'],
    route: '/',
    thumbnail: asset('img/Etta.png'),
    type: 'page',
  },
  {
    id: 'home-about',
    title: '关于我',
    description: 'Laser 的个人介绍、背景与获奖情况',
    tags: ['关于', 'about', '介绍'],
    route: '/',
    scrollTo: 'about',
    type: 'section',
  },
  {
    id: 'home-works',
    title: '代表作品预览',
    description: '首页按分类展示的代表作品卡片',
    tags: ['作品', '代表作品', '预览'],
    route: '/',
    scrollTo: 'works-preview',
    type: 'section',
  },
  {
    id: 'home-skills',
    title: '核心技能',
    description: '技术栈与能力分布',
    tags: ['技能', 'skills', '技术栈'],
    route: '/',
    scrollTo: 'skills',
    type: 'section',
  },
  {
    id: 'home-contact',
    title: '合作咨询',
    description: '联系方式与合作入口（微信二维码 / 邮箱）',
    tags: ['联系', '合作', 'contact', '咨询'],
    route: '/',
    scrollTo: 'contact',
    type: 'section',
  },
  {
    id: 'works-all',
    title: '作品总览',
    description: '按分类浏览全部作品，支持拼音搜索',
    tags: ['作品', '全部作品', 'works', '总览'],
    route: '/works',
    type: 'page',
  },
  {
    id: 'works-aiDev',
    title: '人工智能开发分类',
    description: 'AI 桌面应用 / Web 应用 / 概念方案',
    tags: ['AI', '人工智能', 'aiDev'],
    route: '/works?cat=aiDev',
    type: 'category',
  },
  {
    id: 'works-graphicDesign',
    title: '设计美学分类',
    description: 'UI/UX、海报设计、品牌视觉',
    tags: ['设计', '海报', 'UI', 'graphicDesign'],
    route: '/works?cat=graphicDesign',
    type: 'category',
  },
  {
    id: 'works-videoEditing',
    title: '视频创作分类',
    description: 'AIGC 短片与创意剪辑',
    tags: ['视频', 'AIGC', '剪辑', 'videoEditing'],
    route: '/works?cat=videoEditing',
    type: 'category',
  },
  {
    id: 'works-modeling3d',
    title: '三维建模分类',
    description: '角色渲染与场景设计',
    tags: ['3D', '建模', '建模3d', 'modeling3d'],
    route: '/works?cat=modeling3d',
    type: 'category',
  },
  {
    id: 'works-basicLogic',
    title: '交互开发分类',
    description: '页面与交互开发（QQ音乐等）',
    tags: ['交互', '页面', 'QQ音乐', 'basicLogic'],
    route: '/works?cat=basicLogic',
    type: 'category',
  },
  {
    id: 'works-softwareDev',
    title: '软件/应用开发分类',
    description: '手势控制 / 硬件交互（GestureMouse 等）',
    tags: ['软件', '应用', '手势', 'softwareDev'],
    route: '/works?cat=softwareDev',
    type: 'category',
  },
  {
    id: 'easter-egg',
    title: '隐藏游戏库',
    description: '彩蛋页：隐藏的 6 款小游戏（贪吃蛇、五子棋、扫雷等）',
    tags: ['彩蛋', '游戏', '隐藏', 'easter', '小游戏'],
    route: '/easter-egg',
    type: 'page',
  },
]

// ===== 作品界面：由作品数据自动生成 =====
const WORK_INTERFACES = getAllWorks()
  .filter((w) => !w.easterEgg)
  .map((w) => ({
    id: w.id,
    title: w.title,
    description: w.description || '',
    tags: Array.isArray(w.tags) ? w.tags : [],
    route: `/works/${w.id}`,
    thumbnail: w.thumbnail || '',
    type: 'work',
  }))

// ===== 合并导出 =====
export const INTERFACE_CATALOG = [...STATIC_INTERFACES, ...WORK_INTERFACES]

/**
 * 根据 id 精确查找一个界面；找不到返回 undefined
 * @param {string} id
 */
export function findInterfaceById(id) {
  return INTERFACE_CATALOG.find((itf) => itf.id === id)
}

/**
 * 按关键词 / 标签做本地模糊匹配（本地兜底识别用）
 *
 * 匹配策略（支持自然语言整句，例如"带我去云栖项目"）：
 *  - 整句直接命中标题/描述 → 高权重
 *  - 查询文本中包含清单里的任意"关键词/标签/id/标题词" → 按命中的 token 长度累加
 * @param {string} query
 * @returns {Array} 匹配到的界面列表（按相关度粗略排序）
 */
export function searchInterfaces(query) {
  if (!query) return []
  const q = String(query).toLowerCase().trim()
  const scored = INTERFACE_CATALOG.map((itf) => {
    const title = String(itf.title || '').toLowerCase()
    const desc = String(itf.description || '').toLowerCase()
    // 可被"包含式"匹配的清单关键词：id + 标题按标点切词 + 标签
    // （例如标题 "Aerie · 云栖" 会被切出 "aerie" 与 "云栖"，从而命中 "带我去云栖项目"）
    const titleTokens = title.split(/[^\p{L}\p{N}]+/u).filter(Boolean)
    const tokens = [itf.id, ...titleTokens, ...(itf.tags || [])]
      .map((t) => String(t).toLowerCase())
      .filter(Boolean)

    let score = 0
    // 1) 整句命中标题或描述（最强的直接匹配）
    if (title.includes(q) || desc.includes(q)) score += 10
    // 2) 查询文本中包含某个清单关键词（支持中文多词整句）
    for (const t of tokens) {
      if (t && t.length >= 2 && q.includes(t)) score += t.length
    }
    return { itf, score }
  })
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.itf)
}
