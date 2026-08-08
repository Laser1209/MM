# AI 感知当前所在页面 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让 AI（Etta）知道自己此刻所在的页面，从而在彩蛋页等位置被问"这是哪里/现在在哪/这是什么页面"时，能准确回答当前页面，而不是泛泛介绍整个站点。

**Architecture:** AIChatPanel 通过 `useLocation()` 获取当前路由，在每次调用 `aiEngine.sendMessage` 时把 `pathname` 传进去。引擎在构建每次 API 请求时，把"当前位置"作为一个 system 消息注入在基础 system prompt 之后（index 1），并在无 Key 的本地兜底路径用关键词匹配"这是哪里"类提问。当前位置上下文每次请求实时注入，不写入持久化 history，因此不破坏 `pruneHistory` 的前缀缓存结构。

**Tech Stack:** React Router（HashRouter + `useLocation`）、DeepSeek API（Function Calling / JSON 模式）、node:test 单测、Vite 构建。

**关键文件：**
- Create: `src/utils/locationContext.js` — 纯函数，路由 → 页面描述 + 注入文案
- Create: `test/locationContext.test.js` — TDD 单测
- Modify: `src/utils/aiEngine.js` — 接收 location、注入上下文、本地兜底
- Modify: `src/components/ai/AIChatPanel.jsx` — 用 `useLocation` 传递当前路由

**测试命令：** `node --test test/`（项目用 `node:test`，无 npm test script）
**构建命令：** `npm run build`

---

### Task 1: 新建 locationContext 纯函数 + 单测

**Files:**
- Create: `src/utils/locationContext.js`
- Test: `test/locationContext.test.js`

- [ ] **Step 1: 写失败的测试**

创建 `test/locationContext.test.js`：

```js
// test/locationContext.test.js — 当前位置上下文纯函数单测
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { describeLocation, buildLocationContext } from '../src/utils/locationContext.js'

test('describeLocation: 首页返回作品集首页（含空串兜底）', () => {
  assert.equal(describeLocation('/'), '作品集首页')
  assert.equal(describeLocation(''), '作品集首页')
})

test('describeLocation: 作品总览页', () => {
  assert.equal(describeLocation('/works'), '作品总览页')
})

test('describeLocation: 作品详情页', () => {
  assert.equal(describeLocation('/works/ai-aerie'), '某个作品的详情介绍页')
})

test('describeLocation: 彩蛋页', () => {
  assert.equal(describeLocation('/easter-egg'), '彩蛋页（隐藏游戏库）')
})

test('describeLocation: 未知路由兜底', () => {
  assert.equal(describeLocation('/unknown'), '网站内的一个页面')
})

test('buildLocationContext: 包含当前位置与页面名，且不主动剧透游戏名单', () => {
  const ctx = buildLocationContext('/easter-egg')
  assert.ok(ctx.includes('当前所在位置'))
  assert.ok(ctx.includes('彩蛋页'))
  assert.ok(ctx.includes('不要因此主动透露隐藏游戏库的具体游戏名单'))
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test test/locationContext.test.js`
Expected: FAIL，报错 `Cannot find module '../src/utils/locationContext.js'`

- [ ] **Step 3: 实现纯函数**

创建 `src/utils/locationContext.js`：

```js
/**
 * 当前位置上下文 — 让 AI 知道自己此刻所在的页面
 *
 * 纯函数、无依赖，便于独立单测。AIChatPanel 通过 useLocation 获取当前路由后
 * 传给 aiEngine，aiEngine 在每次请求时把它作为 system 消息注入，
 * 使模型能回答"这是哪里 / 现在在哪 / 这是什么页面"等提问。
 */

// 由路由 pathname 描述用户当前所在页面（返回自然的页面名短语）
export function describeLocation(pathname) {
  const p = String(pathname || '/')
  if (p === '/' || p === '') return '作品集首页'
  if (p === '/works') return '作品总览页'
  if (p.startsWith('/works/')) return '某个作品的详情介绍页'
  if (p === '/easter-egg') return '彩蛋页（隐藏游戏库）'
  return '网站内的一个页面'
}

// 构造注入给模型的"当前所在位置"系统消息内容
export function buildLocationContext(pathname) {
  return (
    '【当前所在位置】访客此刻正位于「' +
    describeLocation(pathname) +
    '」。当访客询问"这是哪里""现在在哪""这是什么页面"等问题时，直接告诉访客他现在所在的位置即可，语气保持 Etta 的人设。注意：不要因此主动透露隐藏游戏库的具体游戏名单或解锁方式。'
  )
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `node --test test/locationContext.test.js`
Expected: PASS（6 个用例全过）

- [ ] **Step 5: Commit**

```bash
git add test/locationContext.test.js src/utils/locationContext.js
git commit -m "feat: 新增当前位置上下文纯函数与单测"
```

---

### Task 2: aiEngine 接收位置并注入请求 + 本地兜底

**Files:**
- Modify: `src/utils/aiEngine.js`

- [ ] **Step 1: 引入 locationContext**

在 `src/utils/aiEngine.js` 顶部 import 处（第 1-10 行区域）追加：

```js
import { buildLocationContext } from './locationContext.js'
```

- [ ] **Step 2: 构造函数新增 location 字段**

把构造方法改为：

```js
  constructor() {
    this.history = []
    this.initialized = false
    this.location = '/'
  }
```

- [ ] **Step 3: 新增 buildRequestMessages 辅助方法**

在 `init()` 方法之后新增：

```js
  /** 构建请求 messages：基础 system 恒定在 index 0（前缀缓存友好），
   *  当前位置上下文紧跟其后（每次实时注入，不写入持久化 history） */
  buildRequestMessages() {
    const locationMsg = {
      role: 'system',
      content: buildLocationContext(this.location),
    }
    return [this.history[0], locationMsg, ...this.history.slice(1)]
  }
```

- [ ] **Step 4: sendMessage 接收 location 并传递**

把 `sendMessage` 签名与首部改为：

```js
  async sendMessage(userMessage, location = '/') {
    this.init()
    this.location = location

    this.history.push({ role: 'user', content: userMessage })
```

并把该函数中两处 `getFallbackResponse(userMessage)` 调用改为 `getFallbackResponse(userMessage, this.location)`（第 1 层失败后的 fallback 与最终 fallback 各一处）。

- [ ] **Step 5: requestFunctionCall 使用 buildRequestMessages**

把 `requestFunctionCall` 的请求体改为（用 `messages` 变量替换原来直接引用 `this.history`）：

```js
  async requestFunctionCall() {
    const messages = this.buildRequestMessages()
    const res = await fetch(AI_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages,
        temperature: 0.6,
        max_tokens: 500,
        tools: [NAVIGATE_TOOL_DEF],
        tool_choice: 'auto',
      }),
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const data = await res.json()
    const msg = data.choices?.[0]?.message || {}
    // 记录历史：保留 tool_calls 以保证对话完整性（跳转属终态，面板会执行）
    this.history.push(msg)
    return msg
  }
```

（注意：`this.history.push(msg)` 保留不变，只有请求体的 messages 用 `buildRequestMessages()`。）

- [ ] **Step 6: requestJsonMode 使用 buildRequestMessages**

把 `requestJsonMode` 改为：

```js
  async requestJsonMode() {
    const messages = this.buildRequestMessages().map((m) => ({ ...m }))
    const last = messages[messages.length - 1]
    if (last && last.role === 'user') {
      last.content =
        last.content +
        '\n\n【输出要求】请严格以合法 JSON 输出，结构为 {"text":"给用户的回复文案","action":{"id":"匹配到的界面id"}}；若无法匹配任何界面则省略 action。'
    }
    const res = await fetch(AI_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages,
        temperature: 0.4,
        max_tokens: 600,
        response_format: { type: 'json_object' },
      }),
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const data = await res.json()
    const content = data.choices?.[0]?.message?.content || '{}'
    return extractActionFromJson(content)
  }
```

- [ ] **Step 7: getFallbackResponse 增加位置提问关键词 + 使用 describeLocation**

把签名改为 `getFallbackResponse(userMessage, location = '/')`，并在函数开头（第 1) 本地界面匹配 之前）插入：

```js
    // 0) 当前位置类提问：无 Key/兜底时也能准确告知所在页面
    if (/这是哪里|这是哪|现在在哪|在哪一页|这是什么页面|当前页面|这是什么地方/.test(msg)) {
      return { text: `您现在正位于「${describeLocation(location)}」。有什么想了解的吗？`, action: null, candidates: [], status: 'none' }
    }
```

并在文件顶部 import 追加：

```js
import { buildLocationContext, describeLocation } from './locationContext.js'
```

- [ ] **Step 8: 运行全部测试确认不回归**

Run: `node --test test/`
Expected: 全部 PASS（含原有 localAnswer / aiEnginePrune / chartParser 用例）

- [ ] **Step 9: Commit**

```bash
git add src/utils/aiEngine.js
git commit -m "feat: AI 感知当前所在页面，注入位置上下文"
```

---

### Task 3: AIChatPanel 传递当前路由

**Files:**
- Modify: `src/components/ai/AIChatPanel.jsx`

- [ ] **Step 1: 引入 useLocation**

把第 2 行改为：

```js
import { useNavigate, useLocation } from 'react-router-dom'
```

- [ ] **Step 2: 获取当前路由**

在组件内 `const navigate = useNavigate()` 之后新增：

```js
  const location = useLocation()
```

- [ ] **Step 3: 调用 sendMessage 时传入当前路由**

把 `handleSend` 中 `aiEngine.sendMessage(trimmed)` 改为：

```js
      const res = await aiEngine.sendMessage(trimmed, location.pathname)
```

- [ ] **Step 4: 语法检查**

用 IDE 的 GetDiagnostics 检查 `AIChatPanel.jsx`，Expected: 无错误

- [ ] **Step 5: Commit**

```bash
git add src/components/ai/AIChatPanel.jsx
git commit -m "feat: 聊天面板传递当前路由给 AI"
```

---

### Task 4: 端到端验证 + 构建

**Files:** 无（仅验证）

- [ ] **Step 1: 运行全部单测**

Run: `node --test test/`
Expected: 全部 PASS

- [ ] **Step 2: 构建**

Run: `npm run build`
Expected: exit 0，无报错

- [ ] **Step 3: 手动验证**

`npm run dev` 后：
1. 进入彩蛋页（`/#/easter-egg`），打开 AI 助手，问"这是哪里" → 应回答在彩蛋页（隐藏游戏库）
2. 回到首页 `/#/`，问"这是哪里" → 应回答在作品集首页
3. 问"这里是什么项目？"（内容解答）→ 不应跳转，仍应基于所在页面正文回答
