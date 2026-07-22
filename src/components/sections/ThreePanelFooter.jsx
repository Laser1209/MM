import { useState, useEffect } from 'react'
import { FlaskConical, Leaf, Droplets, Sun, ArrowUpRight } from 'lucide-react'
import useInView from '../../hooks/useInView.js'
import useCountUp from '../../hooks/useCountUp.js'
import { SITE_CONFIG, asset } from '../../config/siteConfig.js'

const CARDS = [
  {
    icon: FlaskConical,
    bg: 'bg-black',
    text: '平面设计 · 海报 · 专辑封面 · 品牌视觉',
  },
  {
    icon: Leaf,
    bg: 'bg-emerald-800',
    text: '视频剪辑 · AIGC · 快节奏宣传片',
  },
  {
    icon: Droplets,
    bg: 'bg-cyan-800',
    text: '三维建模 · 角色渲染 · 场景设计',
  },
  {
    icon: Sun,
    bg: 'bg-amber-700',
    text: '前端开发 · 小游戏 · 交互逻辑',
  },
]

function Panel1() {
  const [ref, inView] = useInView({ threshold: 0.2 })

  return (
    <div
      ref={ref}
      className={`relative bg-[#ECEDEC] p-8 lg:p-12 flex flex-col justify-between min-h-[280px] overflow-hidden ${inView ? 'animate-fade-up delay-900' : 'opacity-0'}`}
    >
      <div>
        <p
          className="text-black max-w-[350px]"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(24px, 3vw, 35px)',
            lineHeight: 1.1,
            letterSpacing: '-0.05em',
          }}
        >
          从设计到代码，探索创意的无限可能
        </p>
      </div>
      <a
        href={`mailto:${SITE_CONFIG.email}`}
        className="inline-flex items-center gap-1 text-black underline mt-6"
        style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', letterSpacing: '-0.03em' }}
      >
        开始合作
        <ArrowUpRight size={16} />
      </a>
    </div>
  )
}

function Panel2() {
  const [ref, inView] = useInView({ threshold: 0.2 })
  const [activeCard, setActiveCard] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % CARDS.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      ref={ref}
      className={`relative bg-[#FEFDF9] p-6 lg:p-8 flex flex-col justify-between min-h-[280px] ${inView ? 'animate-fade-up delay-1000' : 'opacity-0'}`}
    >
      <div className="relative flex-1 flex items-center">
        {CARDS.map((card, i) => {
          const Icon = card.icon
          return (
            <div
              key={i}
              className="absolute inset-0 flex flex-col gap-4 transition-all duration-500"
              style={{
                opacity: i === activeCard ? 1 : 0,
                transform: i === activeCard ? 'translateY(0)' : 'translateY(16px)',
              }}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${card.bg}`}>
                <Icon size={20} className="text-white" />
              </div>
              <p
                className="text-black/80"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: 'clamp(14px, 2vw, 18px)',
                  lineHeight: 1.2,
                  letterSpacing: '-0.03em',
                }}
              >
                {card.text}
              </p>
            </div>
          )
        })}
      </div>

      {/* Bottom dots */}
      <div className="flex gap-1 mt-4">
        {CARDS.map((_, i) => (
          <div
            key={i}
            className="h-0.5 flex-1 rounded-full transition-colors duration-300"
            style={{ background: i === activeCard ? '#000' : 'rgba(0,0,0,0.2)' }}
          />
        ))}
      </div>
    </div>
  )
}

function Panel3() {
  const [ref, inView] = useInView({ threshold: 0.2 })
  const count = useCountUp(14, 1500, inView)

  return (
    <div
      ref={ref}
      className={`relative bg-black p-6 lg:p-8 flex items-center gap-4 min-h-[280px] ${inView ? 'animate-fade-up delay-1100' : 'opacity-0'}`}
    >
      <img
        src={asset('img/Etta.png')}
        alt="Etta"
        className="w-[120px] h-[82px] sm:w-[160px] sm:h-[110px] lg:w-[208px] lg:h-[142px] object-contain flex-shrink-0"
      />
      <div>
        <p
          className="text-white"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(24px, 3vw, 35px)',
            letterSpacing: '-0.05em',
          }}
        >
          +{count}K
        </p>
        <p
          className="text-white/60 mt-1"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(14px, 2vw, 18px)',
            lineHeight: 1.2,
          }}
        >
          行代码持续成长中
        </p>
      </div>
    </div>
  )
}

export default function ThreePanelFooter() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_2fr] relative z-10">
      <Panel1 />
      <Panel2 />
      <Panel3 />
    </div>
  )
}
