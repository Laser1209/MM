/**
 * 作品数据引擎 — 自动检测 + 元数据合并
 */

import { asset } from '../config/siteConfig.js'
import { WORK_METADATA, CATEGORY_STRUCTURE } from './workMetadata.js'
import manifest from './manifest.json'

// ===== 工具函数 =====

function fileExists(path) {
  if (!path) return false
  const clean = path.replace(/^\//, '')
  return (
    manifest.images.includes(clean) ||
    manifest.programs.includes(clean) ||
    manifest.videos.includes(clean) ||
    manifest.details.includes(clean) ||
    manifest.art.includes(clean) ||
    manifest.modeling.includes(clean) ||
    manifest.aigc.includes(clean)
  )
}

function titleFromFilename(filename) {
  const basename = filename.split('/').pop()
  const nameWithoutExt = basename.replace(/\.[^.]+$/, '')
  return nameWithoutExt
    .replace(/[-_]preview$/i, '')
    .replace(/[-_]render$/i, '')
    .replace(/[-_]/g, ' ')
    .trim()
}

function tagsForCategory(category, subcategory) {
  const tags = ['设计类型', CATEGORY_STRUCTURE[category]?.title || '其他']
  if (subcategory) {
    tags.push(CATEGORY_STRUCTURE[category]?.categories?.[subcategory]?.title || '')
  }
  return tags.filter(Boolean)
}

// ===== 核心逻辑 =====

function buildWorksData() {
  const discovered = new Set()

  // --- Step 1: 处理已注册的元数据 ---
  const registeredWorks = WORK_METADATA.filter((meta) => {
    // 外部项目（AI 项目等）始终通过 — 它们使用外部 URL，不需要本地文件
    if (meta.isExternal) {
      if (meta.thumbnail) discovered.add(meta.thumbnail)
      return true
    }

    const thumbExists = !meta.thumbnail || fileExists(meta.thumbnail)
    const linkExists = !meta.externalLink || fileExists(meta.externalLink)
    const hasContent = thumbExists || linkExists

    if (hasContent && meta.thumbnail) discovered.add(meta.thumbnail)
    if (hasContent && meta.externalLink) discovered.add(meta.externalLink)

    return hasContent
  }).map((meta) => {
    // 外部项目的链接和缩略图保持原样（不通过 asset() 处理）
    if (meta.isExternal) {
      return {
        ...meta,
        thumbnail: meta.thumbnail ? asset(meta.thumbnail) : '',
        tags: meta.tags || tagsForCategory(meta.category, meta.subcategory),
        gallery: meta.gallery ? meta.gallery.map(g => asset(g)) : undefined,
      }
    }
    return {
      ...meta,
      thumbnail: meta.thumbnail ? asset(meta.thumbnail) : '',
      externalLink: meta.externalLink ? asset(meta.externalLink) : undefined,
      tags: tagsForCategory(meta.category, meta.subcategory),
    }
  })

  // --- Step 2: 自动发现 — program/ 中未注册的 HTML ---
  const autoDiscovered = []
  for (const programFile of manifest.programs) {
    if (discovered.has(programFile)) continue
    if (programFile === 'program/qq-music.html') continue
    if (programFile.includes('favicon')) continue

    const basename = programFile.split('/').pop().replace('.html', '')
    let category = 'basicLogic'
    let subcategory = undefined

    if (basename.includes('game') || ['snake', 'gobang', 'minesweeper', 'spider-solitaire', 'threeKills', 'contra'].includes(basename)) {
      category = 'basicLogic'
    } else if (basename.includes('page') || basename.includes('poster')) {
      category = 'graphicDesign'
      subcategory = 'posterDesign'
    }

    autoDiscovered.push({
      id: `auto-${basename}`,
      title: titleFromFilename(programFile),
      description: '自动发现的作品',
      category,
      subcategory,
      thumbnail: '',
      externalLink: asset(programFile),
      tags: tagsForCategory(category, subcategory),
      autoDiscovered: true,
    })
  }

  // --- Step 3: 自动发现 — video/ 中未注册的视频 ---
  for (const videoFile of manifest.videos) {
    if (discovered.has(videoFile)) continue

    autoDiscovered.push({
      id: `auto-video-${videoFile.split('/').pop().replace(/\.[^.]+$/, '')}`,
      title: titleFromFilename(videoFile),
      description: '自动发现的视频作品',
      category: 'videoEditing',
      subcategory: 'aigc',
      thumbnail: '',
      externalLink: asset(videoFile),
      tags: tagsForCategory('videoEditing', 'aigc'),
      autoDiscovered: true,
    })
  }

  // --- Step 4: 合并并按分类结构组织 ---
  const allWorks = [...registeredWorks, ...autoDiscovered]
  const WorksData = {}

  for (const [catKey, catDef] of Object.entries(CATEGORY_STRUCTURE)) {
    const catWorks = allWorks.filter((w) => w.category === catKey)

    if (catDef.categories) {
      const subCats = {}
      for (const [subKey, subDef] of Object.entries(catDef.categories)) {
        subCats[subKey] = {
          title: subDef.title,
          works: catWorks.filter((w) => w.subcategory === subKey),
        }
      }
      WorksData[catKey] = {
        title: catDef.title,
        categories: subCats,
      }
    } else {
      WorksData[catKey] = {
        title: catDef.title,
        works: catWorks,
      }
    }
  }

  return WorksData
}

// ===== 导出 =====

export const WorksData = buildWorksData()

export function getAllWorks() {
  const all = []
  Object.entries(WorksData).forEach(([catKey, cat]) => {
    if (cat.categories) {
      Object.entries(cat.categories).forEach(([subKey, sub]) => {
        sub.works.forEach((w) => {
          all.push({ ...w, category: catKey, subcategory: subKey, categoryTitle: cat.title, subcategoryTitle: sub.title })
        })
      })
    } else if (cat.works) {
      cat.works.forEach((w) => {
        all.push({ ...w, category: catKey, categoryTitle: cat.title })
      })
    }
  })
  return all
}

export function findWorkById(id) {
  return getAllWorks().find((w) => w.id === id)
}

export function getWorksByCategory(catKey) {
  const cat = WorksData[catKey]
  if (!cat) return []
  if (cat.categories) {
    const all = []
    Object.values(cat.categories).forEach((sub) => {
      all.push(...sub.works)
    })
    return all
  }
  return cat.works || []
}

export function getCategoryCount(catKey) {
  return getWorksByCategory(catKey).length
}

export function getCategoryStats() {
  const stats = {}
  for (const catKey of Object.keys(CATEGORY_STRUCTURE)) {
    stats[catKey] = getCategoryCount(catKey)
  }
  return stats
}
