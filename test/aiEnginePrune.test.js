// test/aiEnginePrune.test.js — 前缀缓存友好 + 按 token 裁剪历史的单测
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  estimateTokens,
  pruneHistory,
  MAX_HISTORY_TOKENS,
} from '../src/utils/tokenPrune.js'

test('estimateTokens: 中文字符 token 数显著高于等长英文字符', () => {
  const cjk = estimateTokens('中文'.repeat(20))
  const ascii = estimateTokens('a'.repeat(20))
  assert.ok(cjk >= 1)
  assert.ok(ascii >= 1)
  assert.ok(cjk > ascii, '中文应按更少字符/token 计，token 数应更多')
})

test('estimateTokens: 可处理 message 对象（JSON 序列化兜底）', () => {
  const cost = estimateTokens({ role: 'user', content: '你好' })
  assert.ok(Number.isFinite(cost) && cost >= 1)
})

test('pruneHistory: system 始终保留在 index 0（前缀缓存友好）', () => {
  const sys = { role: 'system', content: 'SYS' }
  const history = [sys, { role: 'user', content: 'u1' }, { role: 'assistant', content: 'a1' }]
  const r = pruneHistory(history)
  assert.equal(r[0], sys)
  assert.deepEqual(
    r.slice(1).map((m) => m.content),
    ['u1', 'a1'],
  )
})

test('pruneHistory: 超 token 预算时从最旧消息开始裁，最新 user 必保留', () => {
  const sys = { role: 'system', content: 'SYS' }
  // 12000 个 ascii 字符 ≈ 3000 token，超出 MAX_HISTORY_TOKENS 预算
  const big = { role: 'user', content: 'x'.repeat(12000) }
  const history = [sys, big, { role: 'assistant', content: 'a' }, { role: 'user', content: 'latest' }]
  const r = pruneHistory(history)
  assert.equal(r[0], sys)
  assert.equal(r[r.length - 1].content, 'latest', '最新用户消息必须保留')
  const droppedBig = !r.some((m) => m === big)
  assert.ok(droppedBig, '超预算的最旧大消息应被裁剪')
})

test('pruneHistory: 预算常量应为正数且可调', () => {
  assert.ok(MAX_HISTORY_TOKENS > 0)
})
