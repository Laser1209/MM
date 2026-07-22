import { useState } from 'react'
import { X, Mail, Github } from 'lucide-react'
import { SITE_CONFIG } from '../../config/siteConfig.js'
import useInView from '../../hooks/useInView.js'

export default function Contact({ onQRClick }) {
  const [ref, inView] = useInView({ threshold: 0.2 })

  return (
    <section
      id="contact"
      ref={ref}
      className="relative px-5 sm:px-8 lg:px-10 py-24 min-h-[60vh] flex flex-col items-center justify-center"
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
        Get in Touch
      </p>

      <h2
        className={`mb-8 text-center ${inView ? 'animate-word-reveal' : 'opacity-0'}`}
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 400,
          letterSpacing: '-0.05em',
          fontSize: 'clamp(36px, 7vw, 64px)',
          lineHeight: 1.1,
        }}
      >
        <span style={{ animationDelay: '0.1s' }}>合作</span>{' '}
        <span style={{ animationDelay: '0.2s' }}>咨询</span>
        <span style={{ animationDelay: '0.3s', color: '#5ed29c' }}>.</span>
      </h2>

      <p
        className={`mb-10 text-center text-white/60 ${inView ? 'animate-fade-up delay-400' : 'opacity-0'}`}
        style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', maxWidth: '400px' }}
      >
        {SITE_CONFIG.tagline}
      </p>

      {/* Contact buttons */}
      <div className={`flex flex-col sm:flex-row gap-4 ${inView ? 'animate-fade-up delay-600' : 'opacity-0'}`}>
        {/* WeChat QR */}
        <button
          onClick={onQRClick}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-bold uppercase tracking-wide transition-all hover:scale-105"
          style={{
            background: '#5ed29c',
            color: '#070b0a',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          }}
        >
          Hire me
        </button>

        {/* Email */}
        <a
          href={`mailto:${SITE_CONFIG.email}`}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-bold uppercase tracking-wide transition-all hover:scale-105 border border-white/20 text-white hover:border-[#5ed29c] hover:text-[#5ed29c]"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}
        >
          <Mail size={16} />
          Email
        </a>

        {/* GitHub */}
        <a
          href={SITE_CONFIG.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-full font-bold uppercase tracking-wide transition-all hover:scale-105 border border-white/20 text-white hover:border-[#5ed29c] hover:text-[#5ed29c]"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}
        >
          <Github size={16} />
          GitHub
        </a>
      </div>
    </section>
  )
}
