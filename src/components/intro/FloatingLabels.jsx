import { ChevronDown, MessageCircle } from 'lucide-react'

export default function FloatingLabels({ onNavigate, onAIChat }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Navigation anchor labels — positioned around the hero area */}
      <div className="absolute top-[22%] left-[8%] sm:left-[12%] pointer-events-auto animate-fade-up delay-1000">
        <button
          onClick={() => scrollTo('about')}
          className="floating-label text-xs sm:text-sm text-white/50 font-sans tracking-wide"
        >
          About
        </button>
      </div>

      <div className="absolute top-[22%] right-[8%] sm:right-[12%] pointer-events-auto animate-fade-up delay-1100">
        <button
          onClick={() => onNavigate('/works')}
          className="floating-label text-xs sm:text-sm text-white/50 font-sans tracking-wide"
        >
          Works
        </button>
      </div>

      <div className="absolute bottom-[30%] left-[10%] sm:left-[15%] pointer-events-auto animate-fade-up delay-1200">
        <button
          onClick={() => scrollTo('skills')}
          className="floating-label text-xs sm:text-sm text-white/50 font-sans tracking-wide"
        >
          Skills
        </button>
      </div>

      <div className="absolute bottom-[30%] right-[10%] sm:right-[15%] pointer-events-auto animate-fade-up delay-1200">
        <button
          onClick={() => scrollTo('contact')}
          className="floating-label text-xs sm:text-sm text-white/50 font-sans tracking-wide"
        >
          Contact
        </button>
      </div>

      {/* Guide link labels */}
      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 pointer-events-auto animate-fade-up delay-1200">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <button
            onClick={() => onNavigate('/works')}
            className="floating-label text-xs text-white/40 font-sans"
          >
            查看全部作品 →
          </button>
          <button
            onClick={() => scrollTo('contact')}
            className="floating-label text-xs text-white/40 font-sans"
          >
            联系合作 →
          </button>
          <button
            onClick={onAIChat}
            className="floating-label text-xs text-white/40 font-sans flex items-center gap-1"
          >
            <MessageCircle size={12} />
            AI对话
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 scroll-indicator pointer-events-none">
        <ChevronDown size={24} className="text-white/30" />
      </div>
    </div>
  )
}
