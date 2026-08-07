# Etta | Creative Developer Portfolio

> 中 / EN · 个人作品集单页应用 · AI 全栈开发 × 视觉设计
> A personal portfolio SPA built with React + Vite + Tailwind CSS, featuring an AI chat assistant and a hidden game library easter egg.

Laser（伊泽）的个人作品集 —— 一个从视觉出发、用代码落地的全栈创作者主页。站内收录平面设计、UI/UX、视频剪辑、三维建模、交互开发与 AI 项目，并内置一个可对话的 AI 助手「Etta」与彩蛋隐藏游戏库。

---

## 技术栈 / Tech Stack

| 层 | 技术 |
| --- | --- |
| 框架 | React 18 · React Router 6 (HashRouter) |
| 构建 | Vite 5 · @vitejs/plugin-react |
| 样式 | Tailwind CSS 3 · PostCSS · Autoprefixer |
| 图标 | lucide-react |
| 搜索 | pinyin-pro（拼音搜索） |
| 视频 | hls.js（入场 HLS 视频流） |
| 媒体处理 | sharp · pdf2png（构建脚本） |
| AI 对话 | DeepSeek Chat API（双层识别 + 本地兜底） |

---

## 功能特性 / Features

- **入场动画场景** — 融合 HLS 背景视频、中央光晕、浮动标签与网格线的介绍场景
- **首页分区** — 关于我、代表作品预览、核心技能、联系方式（含微信二维码弹窗）
- **作品总览页** — 分类导航、拼音/关键词搜索、作品卡片流，第一个分类为「人工智能开发」
- **作品详情页** — 每个作品独立详情，含描述、标签、图集与相关作品推荐
- **AI 聊天助手「Etta」** — 悬浮对话面板，支持多轮对话、界面识别与一键跳转（详见下方「AI 模块」）
- **彩蛋隐藏游戏库** — 点击导航栏 Logo 10 次解锁 6 款小游戏（贪吃蛇、五子棋、扫雷、蜘蛛纸牌、跳一跳、魂斗罗）
- **自定义光标** — CustomCursor 全局自定义鼠标效果

---

## 路由 / Routes

| 路径 | 页面 | 说明 |
| --- | --- | --- |
| `#/` | HomePage | 首页（入场 + 各分区） |
| `#/works` | WorksPage | 作品总览（支持 `?cat=` 分类） |
| `#/works/:id` | DetailPage | 作品详情 |
| `#/easter-egg` | EasterEggPage | 彩蛋隐藏游戏库 |

> 使用 HashRouter，兼容 GitHub Pages 等静态托管，无需服务端回退配置。

---

## AI 模块 / AI Module

AI 助手采用「双层识别 + 本地兜底」策略，保证任何情况下都能响应：

1. **Function Calling** — 请求带 `tools`，模型原生返回结构化 `tool_calls`，解析后跳转
2. **JSON 模式** — Function Calling 失败时，用 `response_format` 强制合法 JSON
3. **本地兜底** — 未配置 API Key 或 API 不可用时，走关键词 / 本地界面匹配

核心文件：

| 文件 | 职责 |
| --- | --- |
| `src/utils/aiEngine.js` | AI 引擎：对话 + 界面调用（三层识别） |
| `src/utils/actionParser.js` | 解析 AI 输出为可执行动作 |
| `src/data/interfaceCatalog.js` | 界面清单：AI 可跳转目的地的权威注册表 |
| `src/data/aiPrompt.js` | 系统提示词（人设、多轮追问、跳转规则） |
| `src/components/ai/AIChatPanel.jsx` | 聊天面板 UI（消息气泡、动作卡片、候选列表） |

**AI 配置**：`src/config/aiConfig.js` 被 `.gitignore` 忽略，本地开发手动创建；CI 部署时由 GitHub Actions 通过 `secrets.DEEPSEEK_API_KEY` 自动注入。未配置时 AI 自动切换本地兜底模式。

---

## 作品数据管理 / Works Data

作品数据由 **两份来源合并生成**（见 `src/data/worksData.js`）：

- **`src/data/manifest.json`** — 构建脚本自动扫描 `public/` 生成的文件清单
- **`src/data/workMetadata.js`** — 人工维护的标题、描述、分类等元数据

因此每次启动 / 构建前都必须先运行 manifest 生成脚本，确保数据与磁盘文件同步。

```bash
npm run manifest   # 扫描 public/ 并重写 src/data/manifest.json
```

- 新增静态作品：把文件放入 `public/` 对应目录，并在 `workMetadata.js` 登记元数据
- 外部项目（GitHub 等）：标记 `isExternal: true`，仅登记元数据即可

---

## 快速开始 / Quick Start

```bash
# 1. 安装依赖
npm install

# 2. 本地开发（自动先跑 manifest）
npm run dev        # http://localhost:5173

# 3. 生产构建（自动先跑 manifest）
npm run build      # 输出到 dist/

# 4. 本地预览构建产物
npm run preview
```

> 也可用根目录 `server.js`（Node 静态服务器）预览旧版静态页。

---

## 项目结构 / Project Structure

```
├── src/
│   ├── components/
│   │   ├── ai/          # AI 聊天面板
│   │   ├── intro/       # 入场场景（IntroScene、Navbar 等）
│   │   ├── layout/      # 自定义光标、滚动回顶
│   │   ├── sections/    # 首页分区（About、Skills、Contact、WorksPreview）
│   │   └── works/       # 作品卡片、分类导航、搜索
│   ├── config/
│   │   ├── siteConfig.js   # 站点全局配置（品牌、联系方式、技能、奖项）
│   │   └── aiConfig.js     # AI 配置（.gitignore 忽略）
│   ├── data/           # 作品元数据、清单、界面注册表、AI 提示词
│   ├── hooks/          # useInView / useCountUp / useLocalStorage / useMediaQuery
│   ├── pages/          # HomePage / WorksPage / DetailPage / EasterEggPage
│   ├── utils/          # aiEngine / actionParser / pinyinSearch
│   ├── App.jsx         # 路由与全局布局
│   └── main.jsx        # 应用入口
├── public/
│   ├── program/        # 交互作品（QQ音乐、小游戏 HTML）
│   ├── img/            # 作品缩略图
│   ├── video/          # AIGC 视频作品
│   ├── detail/         # 历史静态详情页（已不再被引用）
│   ├── art/ modeling/ AIGC/  # 设计稿、建模源文件、工作流
├── scripts/
│   ├── generate-manifest.mjs  # 自动扫描生成 manifest.json
│   └── pdf2png.mjs            # PDF 转 PNG 工具
└── .github/workflows/deploy.yml  # GitHub Pages 自动部署
```

---

## 部署 / Deployment

推送到 `main` 分支即触发 [deploy.yml](.github/workflows/deploy.yml) 自动构建并部署到 **GitHub Pages**：

1. Node 20 + `npm ci` 安装依赖
2. 通过 `secrets.DEEPSEEK_API_KEY` 注入 `src/config/aiConfig.js`
3. `npm run build` 产出 `dist/`
4. 上传并发布到 GitHub Pages

仓库需在 GitHub 设置中启用 Pages（Source: GitHub Actions）。

---

## 模块验证 / Module Status (2026-08-08)

验证方式：`npm run build` 构建 + `npm run dev` 本地运行 + 浏览器逐路由实测。

| 模块 | 状态 | 说明 |
| --- | --- | --- |
| 构建（build） | PASS | 1602 modules，产物正常生成 |
| 首页 `#/` | PASS | 入场、About、WorksPreview、Skills、Contact 均渲染 |
| 作品总览 `#/works` | PASS | 分类导航（AI 开发置顶）、搜索、卡片跳转正常 |
| 作品详情 `#/works/:id` | PASS | 描述、标签、相关作品正常 |
| 彩蛋游戏库 `#/easter-egg` | PASS | 6 款隐藏小游戏正常展示 |
| AI 聊天面板 | PASS | 本地兜底逻辑可用（无 Key 时仍可回复并跳转） |
| 彩蛋解锁（Logo ×10） | PASS | 逻辑正确，连点 10 次跳转 `/easter-egg` |

> 非阻塞提示：入场 HLS 视频流为远程资源（Mux CDN），偶发 `ERR_ABORTED`，不影响功能。React Router v6 future flags 已显式启用（`v7_startTransition` / `v7_relativeSplatPath`），弃用警告已消除。

---

## 许可证 / License

本项目仅用于个人学习与展示，作品与代码版权归原作者 Laser（伊泽）所有。
