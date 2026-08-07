// test/localAnswer.test.js — 「本地规则先行」内容解答兜底的单测
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isNavIntent, getLocalAnswer } from '../src/utils/localAnswer.js'

test('isNavIntent: 导航意图命中', () => {
  assert.equal(isNavIntent('带我去Aerie这个项目'), true)
  assert.equal(isNavIntent('打开隐藏游戏库'), true)
  assert.equal(isNavIntent('跳转到作品总览'), true)
  assert.equal(isNavIntent('前往我的主页'), true)
})

test('isNavIntent: 内容解答不误判为导航', () => {
  assert.equal(isNavIntent('Aerie是什么项目'), false)
  assert.equal(isNavIntent('介绍一下Braintoss'), false)
  assert.equal(isNavIntent('输出这个项目的内容'), false)
})

test('getLocalAnswer: 具体项目内容解答 → 返回作品信息', () => {
  const r = getLocalAnswer('Aerie · 云栖是什么项目？')
  assert.ok(r, '应命中本地作品解答')
  assert.ok(r.text.includes('Aerie') || r.text.includes('云栖'), '答案应包含作品名')
})

test('getLocalAnswer: 讲一讲某个作品 → 返回作品信息', () => {
  const r = getLocalAnswer('Braintoss 这个工具是干什么的')
  assert.ok(r, '应命中本地作品解答')
  assert.ok(r.text.includes('Braintoss'), '答案应包含作品名')
})

test('getLocalAnswer: 有哪些作品 → 返回分类清单', () => {
  const r = getLocalAnswer('你主人有哪些作品？')
  assert.ok(r, '应命中清单解答')
  assert.ok(r.text.includes('人工智能开发'), '清单应含分类')
})

test('getLocalAnswer: 未知/无作品语境 → 返回 null（走 LLM）', () => {
  assert.equal(getLocalAnswer('你好呀'), null)
  assert.equal(getLocalAnswer('介绍一下这个项目'), null) // 未指名，交由 LLM 追问
})
