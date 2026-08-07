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
