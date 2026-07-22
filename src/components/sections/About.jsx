import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { SITE_CONFIG } from '../../config/siteConfig.js'
import useInView from '../../hooks/useInView.js'

export default function About() {
  const [expanded, setExpanded] = useState(false)
  const [needsCollapse, setNeedsCollapse] = useState(false)
  const textRef = useRef(null)
  const [ref, inView] = useInView({ threshold: 0.2 })

  // After mount and when text renders, check if content exceeds collapsed height
  useEffect(() => {
    if (textRef.current) {
      // If the natural scrollHeight exceeds our collapsed max-height, show the button
      setNeedsCollapse(textRef.current.scrollHeight > 120)
    }
  }, [])

  const paragraphs = SITE_CONFIG.aboutText.split('\n\n').filter(Boolean)

  return (
    <section
      id="about"
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 lg:px-10 py-24"
    >
      <p
        className={`mb-4 ${inView ? 'animate-fade-in' : 'opacity-0'}`}
        style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontWeight: 700,
          fontSize: '11px',
          color: '#5ed29c',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}
      >
        About Me
      </p>

      <h2
        className={`mb-10 text-center ${inView ? 'animate-word-reveal' : 'opacity-0'}`}
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 400,
          letterSpacing: '-0.05em',
          fontSize: 'clamp(32px, 6vw, 56px)',
          lineHeight: 1.1,
        }}
      >
        <span style={{ animationDelay: '0.1s' }}>从设计</span>{' '}
        <span style={{ animationDelay: '0.2s' }}>到代码</span>{' '}
        <span style={{ animationDelay: '0.3s', color: 'rgba(255,255,255,0.45)' }}>的跨界</span>
      </h2>

      <div
        className={`max-w-[700px] w-full ${inView ? 'animate-fade-up delay-400' : 'opacity-0'}`}
      >
        <div
          ref={textRef}
          className="text-white/70 leading-relaxed transition-[max-height,opacity] duration-500 ease-out overflow-hidden"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            lineHeight: 1.8,
            maxHeight: expanded ? `${textRef.current?.scrollHeight || 2000}px` : needsCollapse ? '120px' : 'none',
            WebkitMaskImage: !expanded && needsCollapse
              ? 'linear-gradient(to bottom, black 60%, transparent 100%)'
              : 'none',
            maskImage: !expanded && needsCollapse
              ? 'linear-gradient(to bottom, black 60%, transparent 100%)'
              : 'none',
          }}
        >
          {paragraphs.map((p, i) => (
            <p key={i} className={i > 0 ? 'mt-4' : ''}>{p}</p>
          ))}
        </div>

        {needsCollapse && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-white/50 hover:text-[#5ed29c] transition-colors text-xs"
            >
              {expanded ? '收起' : '展开全文'}
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
