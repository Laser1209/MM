/**
 * 自动检测脚本 — 扫描 public/ 目录，生成文件清单 manifest.json
 * 在 dev / build 前自动运行，确保作品数据与实际文件同步
 *
 * 扫描范围：
 *   public/program/*.html   → 交互式作品（游戏、页面）
 *   public/img/*.{png,jpg,jpeg,svg,pdf} → 缩略图 / 图片资源
 *   public/video/*.{mp4,webm} → 视频作品
 *   public/detail/*.html     → 作品详情页
 *   public/art/*             → 原始设计稿
 *   public/modeling/*        → 三维建模源文件
 *   public/AIGC/*            → AIGC 工作流文件
 */

import { readdirSync, statSync, existsSync, writeFileSync, mkdirSync } from 'fs'
import { join, extname, relative, resolve } from 'path'

const ROOT = process.cwd()
const PUBLIC_DIR = join(ROOT, 'public')
const OUTPUT_DIR = join(ROOT, 'src', 'data')
const OUTPUT_FILE = join(OUTPUT_DIR, 'manifest.json')

// 支持的文件扩展名
const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.pdf']
const VIDEO_EXTS = ['.mp4', '.webm', '.mov', '.avi']
const HTML_EXT = '.html'

/**
 * 递归扫描目录，返回所有文件的相对路径
 */
function scanDir(dir, baseDir = dir) {
  const results = []
  if (!existsSync(dir)) return results

  const entries = readdirSync(dir)
  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      results.push(...scanDir(fullPath, baseDir))
    } else {
      const relPath = relative(baseDir, fullPath).replace(/\\/g, '/')
      results.push(relPath)
    }
  }
  return results
}

/**
 * 扫描指定子目录（仅顶层文件，不递归）
 */
function scanTopLevel(subdir) {
  const dir = join(PUBLIC_DIR, subdir)
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => !statSync(join(dir, f)).isDirectory())
    .map((f) => `${subdir}/${f}`)
}

// ===== 生成 manifest =====
const manifest = {
  generatedAt: new Date().toISOString(),
  programs: [],   // public/program/*.html — 游戏和页面
  images: [],     // public/img/* — 缩略图
  videos: [],     // public/video/* — 视频
  details: [],    // public/detail/*.html — 详情页
  art: [],        // public/art/* — 原始设计稿
  modeling: [],   // public/modeling/* — 3D 源文件
  aigc: [],       // public/AIGC/* — AIGC 文件
}

// 1. 扫描 program/ (仅顶层 .html，排除 font/ img/ 等子目录)
const programDir = join(PUBLIC_DIR, 'program')
if (existsSync(programDir)) {
  manifest.programs = readdirSync(programDir)
    .filter((f) => f.endsWith(HTML_EXT) && statSync(join(programDir, f)).isFile())
    .map((f) => `program/${f}`)
}

// 2. 扫描 img/ (仅顶层文件)
manifest.images = scanTopLevel('img').filter((f) =>
  IMAGE_EXTS.includes(extname(f).toLowerCase())
)

// 3. 扫描 video/
manifest.videos = scanTopLevel('video').filter((f) =>
  VIDEO_EXTS.includes(extname(f).toLowerCase())
)

// 4. 扫描 detail/
manifest.details = scanTopLevel('detail').filter((f) => f.endsWith(HTML_EXT))

// 5. 扫描 art/ (递归)
manifest.art = scanDir(join(PUBLIC_DIR, 'art')).map((f) => `art/${f}`)

// 6. 扫描 modeling/ (递归)
manifest.modeling = scanDir(join(PUBLIC_DIR, 'modeling')).map((f) => `modeling/${f}`)

// 7. 扫描 AIGC/ (递归)
manifest.aigc = scanDir(join(PUBLIC_DIR, 'AIGC')).map((f) => `AIGC/${f}`)

// 统计
manifest.summary = {
  totalPrograms: manifest.programs.length,
  totalImages: manifest.images.length,
  totalVideos: manifest.videos.length,
  totalDetails: manifest.details.length,
  totalArt: manifest.art.length,
  totalModeling: manifest.modeling.length,
  totalAigc: manifest.aigc.length,
}

// 写入文件
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true })
}
writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2), 'utf-8')

console.log('✓ Manifest generated:', OUTPUT_FILE)
console.log(
  `  Programs: ${manifest.summary.totalPrograms} | Images: ${manifest.summary.totalImages} | Videos: ${manifest.summary.totalVideos}`
)
console.log(
  `  Details: ${manifest.summary.totalDetails} | Art: ${manifest.summary.totalArt} | Modeling: ${manifest.summary.totalModeling} | AIGC: ${manifest.summary.totalAigc}`
)
