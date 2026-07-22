import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, Play, ExternalLink, Brain, X, Globe, Github } from 'lucide-react'

export default function WorkCard({ work, index }) {
  const navigate = useNavigate()
  const [showDetail, setShowDetail] = useState(false)

  const handleClick = () => {
    // AI external projects with description → show detail modal instead of navigating directly
    if (work.isExternal) {
      setShowDetail(true)
      return
    }
    if (work.externalLink) {
      window.open(work.externalLink, '_blank')
    } else if (work.id) {
      navigate(`/works/${work.id}`)
    }
  }

  const isVideo = work.externalLink && work.externalLink.endsWith('.mp4')
  const isGame = work.externalLink && work.externalLink.endsWith('.html')
  const isAI = work.isExternal

  return (
    <>
      <button
        onClick={handleClick}
        className={`group text-left rounded-xl overflow-hidden transition-all hover:scale-[1.02] animate-fade-up ${
          isAI ? 'ring-1 ring-[#5ed29c]/20' : ''
        }`}
        style={{
          animationDelay: `${index * 0.08}s`,
          background: isAI
            ? 'linear-gradient(135deg, rgba(94, 210, 156, 0.05), rgba(255, 255, 255, 0.02))'
            : 'rgba(255, 255, 255, 0.03)',
          border: isAI ? '1px solid rgba(94, 210, 156, 0.15)' : '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Thumbnail */}
        <div className={`relative overflow-hidden bg-black/40 ${isAI ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
          {work.thumbnail ? (
            <img
              src={work.thumbnail}
              alt={work.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {isAI ? (
                <Brain size={48} strokeWidth={1} className="text-[#5ed29c]/30" />
              ) : (
                <span className="text-white/20 text-sm">Preview</span>
              )}
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#5ed29c] flex items-center justify-center">
              {isVideo ? (
                <Play size={20} className="text-[#070b0a] ml-1" fill="#070b0a" />
              ) : isAI ? (
                <Brain size={20} className="text-[#070b0a]" />
              ) : (
                <ArrowUpRight size={20} className="text-[#070b0a]" />
              )}
            </div>
          </div>

          {/* Type badge */}
          {isAI && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
              style={{ background: 'rgba(94, 210, 156, 0.9)', color: '#070b0a', fontFamily: 'Inter, sans-serif' }}>
              <Brain size={10} /> AI Project
            </div>
          )}
          {isVideo && !isAI && (
            <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
              style={{ background: 'rgba(94, 210, 156, 0.9)', color: '#070b0a', fontFamily: 'Inter, sans-serif' }}>
              Video
            </div>
          )}
          {isGame && !isAI && (
            <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
              style={{ background: 'rgba(94, 210, 156, 0.9)', color: '#070b0a', fontFamily: 'Inter, sans-serif' }}>
              Playable
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <h3
              className={`text-white text-sm truncate ${isAI ? 'font-semibold' : ''}`}
              style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.03em' }}
            >
              {work.title}
            </h3>
            {isAI && work.externalLink && <ExternalLink size={11} className="text-[#5ed29c] flex-shrink-0" />}
          </div>
          {work.description && (
            <p className={`text-white/40 text-xs line-clamp-2 leading-relaxed ${isAI ? 'line-clamp-3' : ''}`}>
              {work.description}
            </p>
          )}
          {/* Tech tags for AI projects */}
          {isAI && work.tags && (
            <div className="flex flex-wrap gap-1 mt-2">
              {work.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 rounded text-[9px] font-medium text-[#5ed29c]/80"
                  style={{ background: 'rgba(94, 210, 156, 0.1)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </button>

      {/* AI Project Detail Modal */}
      {isAI && showDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl animate-scale-in"
            style={{
              background: '#0d1110',
              border: '1px solid rgba(94, 210, 156, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowDetail(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
            >
              <X size={18} className="text-white/60" />
            </button>

            {/* Hero */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl bg-black/50">
              {work.thumbnail && (
                <img src={work.thumbnail} alt={work.title} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1110] to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={14} className="text-[#5ed29c]" />
                  <span className="text-[#5ed29c] text-xs font-bold uppercase tracking-wider"
                    style={{ fontFamily: 'Inter, sans-serif' }}>AI Project</span>
                </div>
                <h2 className="text-white text-2xl sm:text-3xl font-semibold"
                  style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.03em' }}>
                  {work.title}
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-white/70 text-sm leading-relaxed mb-6"
                style={{ fontFamily: 'Inter, sans-serif', lineHeight: 1.8 }}>
                {work.description}
              </p>

              {/* Tech tags */}
              {work.tags && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {work.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: 'rgba(94, 210, 156, 0.1)',
                        color: '#5ed29c',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Gallery */}
              {work.gallery && work.gallery.length > 0 && (
                <div className="mb-6">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-3"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700 }}>
                    项目截图
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {work.gallery.map((img, i) => (
                      <div key={i} className="aspect-[9/16] rounded-lg overflow-hidden bg-black/40">
                        <img src={img} alt={`${work.title} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action links */}
              <div className="flex flex-wrap gap-3">
                {work.previewUrl && (
                  <a
                    href={work.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105"
                    style={{
                      background: '#5ed29c',
                      color: '#070b0a',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    <Globe size={15} /> 访问主页
                  </a>
                )}
                {work.externalLink && (
                  <a
                    href={work.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    <Github size={15} /> GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
