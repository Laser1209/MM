# AI Chat 图表渲染 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让 Etta AI 在聊天回复里能渲染「数据图表」（ECharts）和「流程图/时序图」（Mermaid），通过让 LLM 输出精简的声明式规格（chartSpec JSON / mermaid 代码块）实现。

**Architecture:** LLM 输出两种受控格式——① 一个 `echarts-lite/v1` 协议的精简 chartSpec JSON（放 ` ```echarts ` 代码块内）；② 标准 Mermaid 代码（放 ` ```mermaid ` 代码块内）。前端在现有 `react-markdown` 的 `pre/code` 拦截点识别这两种语言，分别交给 `MarkdownChart`（ECharts 模块化渲染）和 `MermaidRenderer`（动态加载 mermaid）组件渲染。规格解析做成纯函数 `chartParser.js`，用 Node 内置测试运行器 TDD 验证，保证「坏规格 → 优雅降级为显示原始代码」而非崩溃。

**Tech Stack:** React 18 + Vite 5 + react-markdown（已装）+ Apache ECharts（`echarts/core` 模块化）+ Mermaid（动态 import）

**参考的权威开源方案（调研结论）：**
- **LLM 输出精简 chartSpec JSON**（而非完整 ECharts option）是业界主流：OpenVizAI（`chartSpec` + 渲染适配器）、WrenAI / Canner（`ChartSpec = {type,title,xField,yField,color,style}`）、Datalyze（`generate_chart_json` 工具）、chat2plot（vega-lite / 自定义 JSON）。
- Apache ECharts 官方 issue #21592 正在推进「ECharts-Lite」声明式协议 `{protocol, type, title, data:[[...]], options, enhance}`，专为降低 LLM 输出幻觉与 token 消耗设计。本方案的 `echarts-lite/v1` 即据此提炼。
- Mermaid 是 Markdown 渲染图表的既定标准：`react-markdown-mermaid` / `@tntd/react-markdown-mermaid`（rehype 插件），均在 `pre/code` 拦截点识别 `language-mermaid` 后替换为图组件（specforge 的 PR 亦采用同样 seam）。

---

### Task 1: 纯函数图表规格解析器 `src/utils/chartParser.js`（TDD）

**Files:**
- Create: `src/utils/chartParser.js`
- Test: `test/chartParser.test.js`（Node 内置 `node --test`，纯 ESM，无 react/echarts 依赖）

说明：本文件**不 import echarts**，只做「chartSpec JSON → 普通 ECharts option 对象」的纯转换与校验，保证可独立单测。React 组件再负责把 option 交给 ECharts 渲染。

**支持协议**（`echarts-lite/v1`）：

```json
{
  "protocol": "echarts-lite/v1",
  "type": "bar",              // bar | line | area | pie | scatter
  "title": "作品分类数量",
  "data": [
    ["分类", "数量"],
    ["人工智能开发", 6],
    ["设计美学", 12]
  ]
}
```

- 柱/折线/面积/散点：首列为类目，其余列为系列（支持多系列）。
- 饼图：仅取首列（名称）与第 2 列（数值）。

- [ ] **Step 1: 写失败测试**

```js
// test/chartParser.test.js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseChartSpec } from '../src/utils/chartParser.js'

test('bar chart: builds category + series option', () => {
  const r = parseChartSpec(JSON.stringify({
    protocol: 'echarts-lite/v1', type: 'bar', title: '分类',
    data: [['分类', '数量'], ['AI', 6], ['设计', 12]],
  }))
  assert.equal(r.ok, true)
  assert.equal(r.option.series[0].type, 'bar')
  assert.deepEqual(r.option.xAxis[0].data, ['AI', '设计'])
})

test('pie chart: uses name/value', () => {
  const r = parseChartSpec(JSON.stringify({
    protocol: 'echarts-lite/v1', type: 'pie',
    data: [['名', '值'], ['A', 3], ['B', 7]],
  }))
  assert.equal(r.ok, true)
  assert.deepEqual(r.option.series[0].data, [
    { name: 'A', value: 3 }, { name: 'B', value: 7 },
  ])
})

test('invalid JSON -> ok:false with error', () => {
  const r = parseChartSpec('not json {')
  assert.equal(r.ok, false)
  assert.ok(r.error)
})

test('unsupported type -> ok:false', () => {
  const r = parseChartSpec(JSON.stringify({
    protocol: 'echarts-lite/v1', type: 'radar', data: [['a', 'b']],
  }))
  assert.equal(r.ok, false)
  assert.match(r.error, /类型/)
})

test('wrong protocol -> ok:false', () => {
  const r = parseChartSpec(JSON.stringify({ protocol: 'x', type: 'bar', data: [] }))
  assert.equal(r.ok, false)
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test test/chartParser.test.js`
Expected: FAIL（`Cannot find module '../src/utils/chartParser.js'` 或函数不存在）

- [ ] **Step 3: 实现 `src/utils/chartParser.js`**

```js
/**
 * 图表规格解析器 — 把 LLM 输出的精简 chartSpec JSON 转换为 ECharts option
 * 纯函数、不依赖 echarts，便于独立单测与优雅降级
 * 协议：echarts-lite/v1（参考 Apache ECharts issue #21592 提案的 Lite 声明式协议）
 */

const PROTOCOL = 'echarts-lite/v1'
const ALLOWED_TYPES = ['bar', 'line', 'area', 'pie', 'scatter']
const ACCENT = '#5ed29c' // 站点主色（绿色强调）

function toRows(data) {
  if (!Array.isArray(data)) return []
  return data
    .filter((r) => Array.isArray(r))
    .map((r) => r.map((c, i) => (i === 0 ? String(c) : Number(c))))
}

export function parseChartSpec(jsonString) {
  let obj
  try {
    obj = JSON.parse(jsonString)
  } catch {
    return { ok: false, error: '图表 JSON 解析失败' }
  }
  return buildChartOption(obj)
}

export function buildChartOption(spec) {
  if (!spec || typeof spec !== 'object') return { ok: false, error: '无效的图表规格' }
  if (spec.protocol !== PROTOCOL) return { ok: false, error: '未知的图表协议' }

  const type = String(spec.type || '').toLowerCase()
  if (!ALLOWED_TYPES.includes(type)) return { ok: false, error: '不支持的图表类型: ' + type }

  const rows = toRows(spec.data)
  if (rows.length < 2) return { ok: false, error: '图表数据不足（至少需要表头+1行）' }

  const header = rows[0]
  const body = rows.slice(1)
  const title = typeof spec.title === 'string' ? spec.title : ''

  const option = {
    backgroundColor: 'transparent',
    title: title ? { text: title, textStyle: { color: '#fff', fontSize: 13 }, left: 'center', top: 4 } : undefined,
    tooltip: { trigger: 'axis' },
    legend: body.length > 0 ? { textStyle: { color: 'rgba(255,255,255,0.7)', fontSize: 11 }, top: 22 } : undefined,
    grid: { left: 8, right: 12, top: 44, bottom: 8, containLabel: true },
  }

  if (type === 'pie') {
    option.tooltip = { trigger: 'item' }
    option.series = [
      {
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['50%', '56%'],
        itemStyle: { borderColor: '#0d1110', borderWidth: 2 },
        label: { color: 'rgba(255,255,255,0.75)', fontSize: 11 },
        data: body.map((r) => ({ name: r[0], value: Number(r[1]) || 0 })),
      },
    ]
    return { ok: true, chart: type, option }
  }

  const categories = body.map((r) => r[0])
  const seriesCount = Math.max(1, header.length - 1)
  const series = []
  for (let s = 0; s < seriesCount; s++) {
    const isArea = type === 'area'
    series.push({
      name: header[s + 1] || `系列${s + 1}`,
      type: type === 'area' ? 'line' : type,
      smooth: type !== 'bar',
      areaStyle: isArea ? { opacity: 0.18 } : undefined,
      symbolSize: type === 'scatter' ? 9 : 4,
      itemStyle: { color: s === 0 ? ACCENT : undefined },
      data: body.map((r) => Number(r[s + 1]) || 0),
    })
  }

  option.xAxis = [{ type: 'category', data: categories, axisLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11 }, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } } }]
  option.yAxis = [{ type: 'value', axisLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } } }]
  option.series = series
  return { ok: true, chart: type, option }
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `node --test test/chartParser.test.js`
Expected: `pass 5`，`fail 0`

- [ ] **Step 5: 提交**

```bash
git add src/utils/chartParser.js test/chartParser.test.js
git commit -m "feat(ai-chart): 新增纯函数图表规格解析器 chartParser(echarts-lite/v1→ECharts option)，含单测"
```

---

### Task 2: ECharts 渲染组件 `src/components/ai/MarkdownChart.jsx`

**Files:**
- Create: `src/components/ai/MarkdownChart.jsx`

说明：模块化引入 ECharts 以控制体积（`echarts/core` + 所需图表/组件 + Canvas 渲染器）。接收 `{ spec }`（已是 parse 成功的 option）或 `{ raw }`（原始 JSON 字符串，内部解析）。容错：解析失败或空数据 → 回退显示原始代码。

- [ ] **Step 1: 安装依赖**

Run: `npm install echarts`
Expected: `added N packages`，package.json 增加 `"echarts"`

- [ ] **Step 2: 实现组件**

```jsx
import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart, ScatterChart } from 'echarts/charts'
import {
  GridComponent, TooltipComponent, LegendComponent, TitleComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { parseChartSpec } from '../../utils/chartParser.js'

echarts.use([
  BarChart, LineChart, PieChart, ScatterChart,
  GridComponent, TooltipComponent, LegendComponent, TitleComponent,
  CanvasRenderer,
])

export default function MarkdownChart({ raw, height = 220 }) {
  const ref = useRef(null)
  const chartRef = useRef(null)
  const [failed, setFailed] = useState('')

  useEffect(() => {
    const parsed = parseChartSpec(raw)
    if (!parsed.ok) {
      setFailed(parsed.error || '图表解析失败')
      return
    }
    if (!ref.current) return
    const chart = echarts.init(ref.current)
    chart.setOption(parsed.option)
    chartRef.current = chart

    const onResize = () => chart.resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      chart.dispose()
      chartRef.current = null
    }
  }, [raw])

  if (failed) {
    return (
      <pre style={{ margin: '0.4em 0', padding: '0.5em 0.7em', background: 'rgba(255,255,255,0.08)', borderRadius: 6, whiteSpace: 'pre-wrap', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
        {raw}
      </pre>
    )
  }

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height,
        margin: '0.4em 0',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    />
  )
}
```

- [ ] **Step 3: 提交**

```bash
git add src/components/ai/MarkdownChart.jsx package.json package-lock.json
git commit -m "feat(ai-chart): 新增 MarkdownChart ECharts 渲染组件(模块化引入，解析失败回退原始代码)"
```

---

### Task 3: Mermaid 渲染组件 `src/components/ai/MermaidRenderer.jsx`

**Files:**
- Create: `src/components/ai/MermaidRenderer.jsx`

说明：mermaid 体积较大，用**动态 import**（`await import('mermaid')`）避免进主包。`mermaid.initialize` 仅执行一次，每次渲染分配唯一 id，失败回退显示原始代码。

- [ ] **Step 1: 安装依赖**

Run: `npm install mermaid`
Expected: `added N packages`，package.json 增加 `"mermaid"`

- [ ] **Step 2: 实现组件**

```jsx
import { useEffect, useRef, useState } from 'react'

let mermaidReady = null
function getMermaid() {
  if (!mermaidReady) {
    mermaidReady = import('mermaid').then((m) => {
      m.default.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'strict',
      })
      return m.default
    })
  }
  return mermaidReady
}

let uidCounter = 0

export default function MermaidRenderer({ code }) {
  const ref = useRef(null)
  const [failed, setFailed] = useState('')

  useEffect(() => {
    let cancelled = false
    const id = `mermaid-${++uidCounter}`
    getMermaid()
      .then(async (mermaid) => {
        if (cancelled || !ref.current) return
        const { svg } = await mermaid.render(id, code)
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg
        }
      })
      .catch((e) => {
        if (!cancelled) setFailed(String(e && e.message ? e.message : e))
      })
    return () => {
      cancelled = true
    }
  }, [code])

  if (failed) {
    return (
      <pre style={{ margin: '0.4em 0', padding: '0.5em 0.7em', background: 'rgba(255,255,255,0.08)', borderRadius: 6, whiteSpace: 'pre-wrap', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
        {code}
      </pre>
    )
  }

  return (
    <div
      ref={ref}
      style={{
        margin: '0.4em 0',
        padding: '0.6em',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.1)',
        overflowX: 'auto',
      }}
    />
  )
}
```

- [ ] **Step 3: 提交**

```bash
git add src/components/ai/MermaidRenderer.jsx package.json package-lock.json
git commit -m "feat(ai-chart): 新增 MermaidRenderer 组件(动态加载，支持流程图/时序图，失败回退)"
```

---

### Task 4: 接入 react-markdown 代码块拦截（AIChatPanel.jsx）

**Files:**
- Modify: `src/components/ai/AIChatPanel.jsx`（import 区 + MARKDOWN_COMPONENTS）

说明：react-markdown 把围栏代码块渲染成 `<pre><code class="language-xxx">`。按 specforge 的成熟做法，**拦截 `pre`**：检查其子 `code` 的语言 class，若是 `language-mermaid` / `language-echarts`，则用对应图组件替换整个 `<pre>`。

- [ ] **Step 1: 新增 import**

在文件顶部 import 区加入：

```jsx
import MarkdownChart from './MarkdownChart.jsx'
import MermaidRenderer from './MermaidRenderer.jsx'
```

- [ ] **Step 2: 在 MARKDOWN_COMPONENTS 增加 `pre` 拦截**

现有 `MARKDOWN_COMPONENTS` 对象增加 `pre` 项。**关键**：react-markdown 中 `pre` 的 `children` 是一个 `code` 元素，其 `props.className` 形如 `language-mermaid`。实现：

```jsx
pre: ({ children }) => {
  const child = Array.isArray(children) ? children[0] : children
  const cls = child && child.props ? child.props.className : ''
  const codeText = child && child.props ? child.props.children : ''
  const lang = String(cls || '').replace(/^language-/, '').toLowerCase()
  if (lang === 'mermaid') {
    return <MermaidRenderer code={String(codeText)} />
  }
  if (lang === 'echarts' || lang === 'chart') {
    return <MarkdownChart raw={String(codeText)} />
  }
  return <pre style={{ margin: '0.4em 0', padding: '0.5em 0.7em', background: 'rgba(255,255,255,0.08)', borderRadius: 6, overflowX: 'auto' }}>{children}</pre>
},
```

- [ ] **Step 3: 构建验证**

Run: `npm run build`
Expected: 退出码 0，产物生成（可能仍带 chunk 体积提示，非错误）

- [ ] **Step 4: 提交**

```bash
git add src/components/ai/AIChatPanel.jsx
git commit -m "feat(ai-chart): 在 react-markdown 拦截 pre/code，识别 mermaid 与 echarts 代码块并渲染为图表"
```

---

### Task 5: 人设注入图表输出规则（aiPrompt.js）

**Files:**
- Modify: `src/data/aiPrompt.js`

说明：告诉 Etta 何时、如何输出图表。核心约束：只允许两种格式（echarts-lite/v1 的 ` ```echarts ` 块、标准 mermaid 的 ` ```mermaid ` 块），且必须与 markdown 正文并存。

- [ ] **Step 1: 新增【图表输出能力】章节**

在 `【界面导航能力】` 章节之后、`【首次对话开场白】`之前，插入数组项：

```js
'',
'【图表输出能力】',
'你可以用 Markdown 代码块在回复里渲染图表，让数据一目了然。仅支持两种格式：',
'',
'1) 数据图表：当需要展示统计/对比/占比数据时，输出一个 echarts 代码块，内容为遵循 echarts-lite/v1 协议的精简 JSON（protocol、type(bar|line|area|pie|scatter)、title、data 二维数组，首行为表头，首列为类目）：',
'```echarts',
'{ "protocol": "echarts-lite/v1", "type": "bar", "title": "作品分类数量", "data": [["分类","数量"],["人工智能开发",6],["设计美学",12],["视频创作",2],["三维建模",1],["交互开发",7]] }',
'```',
'2) 流程图/时序图：当需要表达流程、步骤、关系或时序时，输出一个 mermaid 代码块（flowchart / sequenceDiagram）：',
'```mermaid',
'flowchart TD',
'  A[AI 识别用户意图] --> B{需要图表?}',
'  B -->|是| C[输出 echarts/mermaid 代码块]',
'  B -->|否| D[仅普通文字回复]',
'```',
'规则：图表代码块与 markdown 正文并存；数据必须是真实准确的（优先用我主人的作品统计）；不要输出除这两种语言以外的图表；若数据不足则不要强行造图。',
```

- [ ] **Step 2: 构建验证 + 提交**

Run: `npm run build`
Expected: 退出码 0

```bash
git add src/data/aiPrompt.js src/data/manifest.json
git commit -m "feat(ai-chart): 人设注入图表输出规则(echarts-lite/v1 与 mermaid 代码块约定)"
```

---

### Task 6: 运行时端到端验证 + 收尾

**Files:**
- Modify: 无（仅验证）
- 运行时验证：启动 dev server，用浏览器自动化打开聊天面板，注入含 ` ```echarts ` 与 ` ```mermaid ` 的假 AI 回复，断言图表容器出现。

- [ ] **Step 1: 准备端到端验证脚本**（临时文件，验证后删除）

用浏览器自动化（如 webapp-testing 技能的 Playwright）：打开站点 → 打开聊天面板 → 通过 `localStorage` 预置一条含 echarts+mermaid 代码块的 assistant 消息 → 刷新 → 断言 `.echarts` 容器与 mermaid 生成的 `svg` 出现。

- [ ] **Step 2: 运行并确认**

Run: dev server + Playwright 脚本
Expected: 图表与流程图均成功渲染，无 console 报错

- [ ] **Step 3: 清理临时脚本 + 收尾提交**

```bash
git add -A
git commit -m "chore(ai-chart): 运行时验证图表渲染通过，收尾提交"
```

---

## Self-Review

**1. Spec 覆盖：**
- 数据图表渲染（ECharts）→ Task 1 + 2 + 4 ✅
- 流程图/时序图渲染（Mermaid）→ Task 3 + 4 ✅
- LLM 受控输出格式 → Task 5（人设规则）✅
- 优雅降级（坏规格不崩溃、回退原始代码）→ Task 1 ok:false 分支 + Task 2/3 failed 分支 ✅
- 运行时验证 → Task 6 ✅

**2. 占位符扫描：** 所有代码步骤均给出完整实现，无 TBD/TODO。✅

**3. 类型/命名一致性：**
- `parseChartSpec(jsonString)` 返回 `{ok, error}` 或 `{ok, chart, option}`；Task 2 用 `parsed.ok`/`parsed.option`/`parsed.error` —— 一致 ✅
- `MarkdownChart` prop `raw`；`MermaidRenderer` prop `code`；Task 4 调用一致 ✅
- 协议常量 `echarts-lite/v1` 在 chartParser 与 aiPrompt 中一致 ✅
