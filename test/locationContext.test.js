// test/locationContext.test.js — 当前位置上下文纯函数单测
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  describeLocation,
  buildLocationContext,
  workIdFromPath,
} from '../src/utils/locationContext.js'

// 测试用最小作品对象（不引入 worksData，避免 Vite 专属全局）
const AERIE = { id: 'ai-aerie', title: 'Aerie · 云栖', description: '本地优先的 AI 桌面伴侣' }

test('describeLocation: 首页返回作品集首页（含空串兜底）', () => {
  assert.equal(describeLocation('/'), '作品集首页')
  assert.equal(describeLocation(''), '作品集首页')
})

test('describeLocation: 作品总览页', () => {
  assert.equal(describeLocation('/works'), '作品总览页')
})

test('describeLocation: 作品详情页未解析作品时返回通用描述', () => {
  assert.equal(describeLocation('/works/ai-aerie'), '某个作品的详情介绍页')
})

test('describeLocation: 作品详情页传入作品后识别具体作品', () => {
  assert.equal(describeLocation('/works/ai-aerie', AERIE), '「Aerie · 云栖」的详情介绍页')
})

test('describeLocation: 彩蛋页', () => {
  assert.equal(describeLocation('/easter-egg'), '彩蛋页（隐藏游戏库）')
})

test('describeLocation: 未知路由兜底', () => {
  assert.equal(describeLocation('/unknown'), '网站内的一个页面')
})

test('workIdFromPath: 解析详情页作品 id', () => {
  assert.equal(workIdFromPath('/works/ai-aerie'), 'ai-aerie')
  assert.equal(workIdFromPath('/works/ai-aerie?x=1'), 'ai-aerie')
  assert.equal(workIdFromPath('/'), null)
  assert.equal(workIdFromPath('/easter-egg'), null)
})

test('buildLocationContext: 包含当前位置与页面名，且不主动剧透游戏名单', () => {
  const ctx = buildLocationContext('/easter-egg')
  assert.ok(ctx.includes('当前所在位置'))
  assert.ok(ctx.includes('彩蛋页'))
  assert.ok(ctx.includes('不要因此主动透露隐藏游戏库的具体游戏名单'))
})

test('buildLocationContext: 详情页传入作品后附上当前作品信息', () => {
  const ctx = buildLocationContext('/works/ai-aerie', AERIE)
  assert.ok(ctx.includes('当前所在位置'))
  assert.ok(ctx.includes('Aerie'))
  assert.ok(ctx.includes('当前作品信息'))
})

