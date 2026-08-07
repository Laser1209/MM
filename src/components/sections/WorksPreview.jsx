import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, Palette, Clapperboard, Box, Code2, Brain, Cpu, ExternalLink } from 'lucide-react'
import { SITE_CONFIG } from '../../config/siteConfig.js'
import { WorksData, getWorksByCategory, getCategoryCount } from '../../data/worksData.js'
import useInView from '../../hooks/useInView.js'

const ICONS = {
  palette: Palette,
  video: Clapperboard,
  cube: Box,
  code: Code2,
  brain: Brain,
  cpu: Cpu,
}

export default function WorksPreview() {
  const navigate = useNavigate()
  const [ref, inView] = useInView({ threshold: 0.15 })

  const handleCategoryClick = (catId) => {
    if (catId === 'aiDev') {
      // AI projects have external links — scroll to them or navigate to works with AI filter
      navigate('/works?cat=aiDev')
    } else {
      navigate(`/works?cat=${catId}`)
    }
  }

  return (
    <section
      id="works-preview"
      ref={ref}
      className="relative px-5 sm:px-8 lg:px-10 py-24"
    >
      {/* Section header */}
      <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p
            className={`mb-3 ${inView ? 'animate-fade-in' : 'opacity-0'}`}
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 700,
              fontSize: '11px',
              color: '#5ed29c',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            Selected Works
          </p>
          <h2
            className={`${inView ? 'animate-word-reveal' : 'opacity-0'}`}
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 400,
              letterSpacing: '-0.05em',
              fontSize: 'clamp(32px, 6vw, 56px)',
              lineHeight: 1.1,
            }}
          >
            <span style={{ animationDelay: '0.1s' }}>代表</span>{' '}
            <span style={{ animationDelay: '0.2s' }}>作品</span>
          </h2>
        </div>

        <button
          onClick={() => navigate('/works')}
          className={`group flex items-center gap-2 text-sm text-white/60 hover:text-[#5ed29c] transition-colors ${inView ? 'animate-fade-up delay-400' : 'opacity-0'}`}
        >
          查看全部作品
          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </button>
      </div>

      {/* Category cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {SITE_CONFIG.workCategories.map((cat, index) => {
          const works = getWorksByCategory(cat.id)
          const firstWork = works[0]
          const Icon = ICONS[cat.icon]
          const isAI = cat.id === 'aiDev'

          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`group text-left rounded-xl overflow-hidden transition-all hover:scale-[1.02] ${inView ? 'animate-fade-up' : 'opacity-0'}`}
              style={{
                animationDelay: `${0.4 + index * 0.1}s`,
                background: isAI
                  ? 'linear-gradient(135deg, rgba(94, 210, 156, 0.08), rgba(94, 210, 156, 0.02))'
                  : 'rgba(255, 255, 255, 0.03)',
                border: isAI
                  ? '1px solid rgba(94, 210, 156, 0.2)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {/* Thumbnail */}
              <div className={`relative ${isAI ? 'aspect-[16/10]' : 'aspect-[4/3]'} overflow-hidden ${isAI ? 'bg-black/40' : 'bg-black/30'}`}>
                {firstWork && firstWork.thumbnail ? (
                  <img
                    src={firstWork.thumbnail}
                    alt={firstWork.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : Icon ? (
                  <div className="w-full h-full flex items-center justify-center opacity-20">
                    <Icon size={isAI ? 56 : 48} strokeWidth={1} className="text-white" />
                  </div>
                ) : null}
                <div
                  className="absolute inset-0"
                  style={{
                    background: isAI
                      ? 'linear-gradient(to top, rgba(7,11,10,0.9) 0%, rgba(7,11,10,0.2) 60%)'
                      : 'linear-gradient(to top, #070b0a, transparent)',
                    opacity: isAI ? 1 : 0.6,
                  }}
                />
                {/* AI badge */}
                {isAI && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: 'rgba(94,210,156,0.2)', color: '#5ed29c', backdropFilter: 'blur(8px)' }}>
                    <Brain size={10} />
                    AI
                  </div>
                )}
                {/* First AI project preview label */}
                {isAI && works[0] && (
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white/80 text-xs flex items-center gap-1">
                      {works[0].title}
                      {works[0].isExternal && works[0].externalLink && <ExternalLink size={10} className="text-[#5ed29c]" />}
                    </p>
                    {works[1] && (
                      <p className="text-white/40 text-[10px] mt-0.5">+{works[1].title} 等 {getCategoryCount(cat.id)} 个项目</p>
                    )}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  {Icon && <Icon size={18} strokeWidth={1.5} className={isAI ? 'text-[#5ed29c]' : 'text-white/60'} />}
                  <span className="text-white/40 text-xs">{getCategoryCount(cat.id)} 作品</span>
                </div>
                <h3
                  className={`text-white text-lg mb-1 ${isAI ? 'font-semibold' : ''}`}
                  style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.03em' }}
                >
                  {cat.title}
                </h3>
                <p className="text-white/40 text-xs">{cat.subtitle}</p>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
