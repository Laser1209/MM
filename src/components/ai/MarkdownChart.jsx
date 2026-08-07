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
