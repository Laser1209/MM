import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Play } from 'lucide-react'
import Navbar from '../components/intro/Navbar.jsx'
import { findWorkById, getAllWorks } from '../data/worksData.js'
import useInView from '../hooks/useInView.js'

export default function DetailPage({ onAIChat }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const work = findWorkById(id)
  const [ref, inView] = useInView({ threshold: 0.15 })

  if (!work) {
    return (
      <div className="min-h-screen bg-[#070b0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 mb-4">作品未找到</p>
          <button
            onClick={() => navigate('/works')}
            className="text-[#5ed29c] text-sm underline"
          >
            返回作品列表
          </button>
        </div>
      </div>
    )
  }

  // Find related works (same category, excluding current)
  const allWorks = getAllWorks()
  const relatedWorks = allWorks
    .filter((w) => w.category === work.category && w.id !== work.id)
    .slice(0, 4)

  const isVideo = work.externalLink && work.externalLink.endsWith('.mp4')
  const isGame = work.externalLink && work.externalLink.endsWith('.html')

  return (
    <div className="min-h-screen bg-[#070b0a]">
      <Navbar onAIChat={onAIChat} />

      <div className="pt-24 px-5 sm:px-8 lg:px-10 pb-24">
        {/* Back button */}
        <button
          onClick={() => navigate('/works')}
          className="flex items-center gap-2 text-white/50 hover:text-[#5ed29c] transition-colors mb-8 animate-fade-in"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">返回作品列表</span>
        </button>

        {/* Title section */}
        <div className="mb-8 animate-fade-up delay-200">
          <div className="flex items-center gap-2 mb-3">
            {work.tags && work.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-full text-[10px] uppercase tracking-wide bg-white/5 text-white/40"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1
            className="mb-4"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 400,
              letterSpacing: '-0.05em',
              fontSize: 'clamp(32px, 6vw, 56px)',
              lineHeight: 1.1,
            }}
          >
            {work.title}
          </h1>
          {work.description && (
            <p
              className="text-white/60 max-w-[600px]"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', lineHeight: 1.6 }}
            >
              {work.description}
            </p>
          )}
        </div>

        {/* Main content area */}
        <div ref={ref} className="mb-12">
          {isVideo ? (
            /* Video player */
            <div className="rounded-xl overflow-hidden bg-black">
              <video
                src={work.externalLink}
                controls
                className="w-full max-h-[70vh] object-contain"
              />
            </div>
          ) : work.thumbnail && !work.isPlaceholder ? (
            /* Image display */
            <div className="rounded-xl overflow-hidden bg-black/30">
              <img
                src={work.thumbnail}
                alt={work.title}
                className="w-full max-h-[70vh] object-contain"
              />
            </div>
          ) : work.isPlaceholder ? (
            <div className="rounded-xl bg-white/5 border border-white/10 flex items-center justify-center py-20">
              <p className="text-white/30">作品即将上线</p>
            </div>
          ) : null}

          {/* External link button */}
          {work.externalLink && !isVideo && (
            <div className="mt-6">
              <a
                href={work.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold uppercase tracking-wide transition-all hover:scale-105"
                style={{
                  background: '#5ed29c',
                  color: '#070b0a',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                }}
              >
                {isGame ? <Play size={16} fill="#070b0a" /> : <ExternalLink size={16} />}
                {isGame ? '开始体验' : '查看详情'}
              </a>
            </div>
          )}
        </div>

        {/* Related works */}
        {relatedWorks.length > 0 && (
          <div className={inView ? 'animate-fade-up delay-600' : 'opacity-0'}>
            <h2
              className="mb-6 text-white/80 text-xl"
              style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.03em' }}
            >
              相关作品
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedWorks.map((rw, index) => (
                <button
                  key={rw.id}
                  onClick={() => navigate(`/works/${rw.id}`)}
                  className="group text-left rounded-xl overflow-hidden transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-black/30">
                    {rw.thumbnail && !rw.isPlaceholder ? (
                      <img
                        src={rw.thumbnail}
                        alt={rw.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
                        即将上线
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-white text-xs truncate">{rw.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
