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
