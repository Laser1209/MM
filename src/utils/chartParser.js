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
