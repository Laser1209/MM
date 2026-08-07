import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { SITE_CONFIG } from '../../config/siteConfig.js'

export default function Navbar({ onAIChat }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [messageIndex, setMessageIndex] = useState(0)
  const [titleClicks, setTitleClicks] = useState(0)

  // Easter egg: click the title bar (brand logo) 10 times to unlock the hidden game library
  const handleTitleClick = () => {
    const next = titleClicks + 1
    if (next >= 10) {
      setTitleClicks(0)
      navigate('/easter-egg')
    } else {
      setTitleClicks(next)
    }
  }

  // Nav loading text marquee
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % SITE_CONFIG.navMessages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 px-5 sm:px-8 lg:px-10 py-4 lg:py-5 animate-fade-in"
        style={{ backdropFilter: 'blur(8px)', background: 'rgba(7, 11, 10, 0.3)' }}
      >
        <nav className="flex items-center justify-between">
          {/* Logo — click 10x to unlock easter egg */}
          <button
            onClick={handleTitleClick}
            className="animate-slide-left delay-200 flex items-center gap-2"
          >
            <img
              src={SITE_CONFIG.logo}
              alt="Etta"
              className="w-8 h-8 object-contain"
            />
            <span
              className="text-white text-2xl font-bold tracking-tight"
              style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.05em' }}
            >
              {SITE_CONFIG.brand}
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 animate-fade-in delay-400">
            <button
              onClick={() => scrollToSection('about')}
              className="text-white/80 hover:text-[#5ed29c] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}
            >
              About
            </button>
            <button
              onClick={() => navigate('/works')}
              className="text-white/80 hover:text-[#5ed29c] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}
            >
              Works
            </button>
            <button
              onClick={() => scrollToSection('skills')}
              className="text-white/80 hover:text-[#5ed29c] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}
            >
              Skills
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-white/80 hover:text-[#5ed29c] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}
            >
              Resume
            </button>
          </div>

          {/* Nav loading text (desktop only) */}
          <div className="hidden lg:block flex-1 max-w-[300px] mx-8 nav-loading-text">
            {SITE_CONFIG.navMessages.map((msg, i) => (
              <span
                key={i}
                className={`nav-loading-item ${
                  i === messageIndex ? 'active' : i === (messageIndex - 1 + SITE_CONFIG.navMessages.length) % SITE_CONFIG.navMessages.length ? 'exit' : ''
                }`}
              >
                {msg}
              </span>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-3 animate-slide-right delay-300">
            <button
              onClick={onAIChat}
              className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all hover:scale-105"
              style={{
                background: '#5ed29c',
                color: '#070b0a',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Hire me
            </button>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-30 bg-black/90 flex flex-col items-center justify-center gap-8 animate-fade-in md:hidden">
          <button
            onClick={() => scrollToSection('about')}
            className="text-2xl text-white hover:text-[#5ed29c] transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            About
          </button>
          <button
            onClick={() => navigate('/works')}
            className="text-2xl text-white hover:text-[#5ed29c] transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Works
          </button>
          <button
            onClick={() => scrollToSection('skills')}
            className="text-2xl text-white hover:text-[#5ed29c] transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Skills
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="text-2xl text-white hover:text-[#5ed29c] transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Resume
          </button>
        </div>
      )}
    </>
  )
}
