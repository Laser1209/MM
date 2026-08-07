import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, Play, Brain } from 'lucide-react'

export default function WorkCard({ work, index }) {
  const navigate = useNavigate()
  const isVideo = work.externalLink && work.externalLink.endsWith('.mp4')
  const isGame = work.externalLink && work.externalLink.endsWith('.html')
  const isAI = work.isExternal

  return (
    <button
      onClick={() => navigate(`/works/${work.id}`)}
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
        </div>
        {work.description && (
          <p className={`text-white/40 text-xs line-clamp-2 leading-relaxed ${isAI ? 'line-clamp-3' : ''}`}>
            {work.description}
          </p>
        )}
        {work.tags && work.tags.length > 0 && (
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
  )
}
