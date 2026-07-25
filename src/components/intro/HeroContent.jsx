import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function HeroContent() {
  const navigate = useNavigate()

  return (
    <div className="relative z-10 flex flex-col items-center text-center px-5">
      {/* Eyebrow */}
      <p
        className="animate-fade-in delay-600 mb-4"
        style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontWeight: 700,
          fontSize: '11px',
          color: '#5ed29c',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}
      >
        Creative Full-Stack · AI Product Builder
      </p>

      {/* Main headline with word reveal */}
      <h1
        className="animate-word-reveal mb-6"
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          fontSize: 'clamp(40px, 8vw, 72px)',
        }}
      >
        <span style={{ animationDelay: '0.7s' }}>LASER</span>{' '}
        <span style={{ animationDelay: '0.8s' }}>CREATES</span>
        <span style={{ animationDelay: '0.9s', color: '#5ed29c' }}>.</span>
      </h1>

      {/* Description */}
      <p
        className="animate-fade-up delay-1000 mb-8"
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.7)',
          maxWidth: '512px',
          lineHeight: 1.6,
        }}
      >
        AI 产品开发 · 全栈工程 · UI/UX 设计 · 创意探索
      </p>

      {/* CTA Button */}
      <button
        onClick={() => navigate('/works')}
        className="animate-fade-up delay-1100 group flex items-center gap-2 rounded-full px-7 py-3 font-bold uppercase tracking-wide transition-all hover:scale-105"
        style={{
          background: '#5ed29c',
          color: '#070b0a',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
        }}
      >
        Explore Works
        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  )
}
