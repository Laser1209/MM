import { useNavigate } from 'react-router-dom'
import { getEasterEggWorks } from '../data/worksData.js'
import { Gamepad2, ArrowLeft } from 'lucide-react'

// ECHOID 风格彩蛋页 — 隐藏游戏库
// 纯黑英雄落地页 + 电影感背景视频 + 终端等宽字体
const FONT_DISPLAY = '"Sora", "Helvetica Neue", Helvetica, Arial, sans-serif'
const FONT_MONO = '"JetBrains Mono", ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace'

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260806_133255_956f653f-5d80-4b06-abd5-0f46c98b60fa.mp4'
const BG_POSTER =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260806_132328_5f9029c8-218f-4489-82b6-29ff2849920e.png'

export default function EasterEggPage() {
  const navigate = useNavigate()
  const games = getEasterEggWorks()

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        height: '100svh',
        minHeight: '640px',
        overflow: 'hidden',
        background: '#000',
        color: '#fff',
        WebkitFontSmoothing: 'antialiased',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        isolation: 'isolate',
      }}
    >
      {/* ===== 背景媒体层 ===== */}
      <div style={{ position: 'absolute', inset: 0, zIndex: -1, background: '#000' }}>
        <video
          src={BG_VIDEO}
          poster={BG_POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* 遮罩 scrim */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, transparent 0%, transparent 45%, rgba(0,0,0,0.45) 72%, rgba(0,0,0,0.72) 100%), linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 22%, transparent 78%, rgba(0,0,0,0.65) 100%)',
          }}
        />
      </div>

      {/* ===== Navbar ===== */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '32px',
          padding: 'clamp(20px, 2.4vw, 34px) clamp(20px, 5vw, 100px)',
          paddingTop: 'max(clamp(20px, 2.4vw, 34px), env(safe-area-inset-top))',
        }}
      >
        <span
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 200,
            fontSize: 'clamp(20px, 1.75vw, 30px)',
            letterSpacing: '0.16em',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          HIDDEN&nbsp;VAULT
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(24px, 3.2vw, 62px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(20px, 2.8vw, 56px)' }}>
            {['Games', 'About'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                style={{
                  fontFamily: FONT_MONO,
                  fontWeight: 400,
                  fontSize: 'clamp(11px, 0.78vw, 14px)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  textDecoration: 'none',
                  transition: 'color 0.25s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.62)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#fff')}
              >
                {link}
              </a>
            ))}
          </div>

          <button
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: FONT_MONO,
              fontWeight: 400,
              fontSize: 'clamp(11px, 0.78vw, 14px)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#fff',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.26)',
              padding: 'clamp(12px, 1vw, 17px) clamp(20px, 1.8vw, 32px)',
              cursor: 'pointer',
              transition: 'background 0.25s ease, border-color 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.26)'
            }}
          >
            <ArrowLeft size={12} />
            Exit
          </button>
        </div>
      </header>

      {/* ===== 右对齐主体 ===== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 clamp(20px, 5vw, 100px)',
          minHeight: 0,
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            width: 'min(34vw, 620px)',
            minWidth: '380px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {/* chip */}
          <span
            style={{
              fontFamily: FONT_MONO,
              fontWeight: 400,
              fontSize: 'clamp(11px, 0.72vw, 14px)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              background: 'rgba(255,255,255,0.09)',
              padding: 'clamp(9px, 0.8vw, 14px) clamp(14px, 1.1vw, 20px)',
              lineHeight: 1,
            }}
          >
            [ Hidden Game Library ]
          </span>

          {/* H1 */}
          <h1
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 200,
              fontSize: 'clamp(54px, 6.2vw, 118px)',
              letterSpacing: '0.03em',
              lineHeight: 0.95,
              marginTop: 'clamp(28px, 3vw, 52px)',
              marginBottom: 0,
            }}
          >
            隐藏游戏库
          </h1>

          {/* tagline */}
          <p
            style={{
              fontFamily: FONT_MONO,
              fontWeight: 300,
              fontSize: 'clamp(11px, 0.94vw, 17px)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.62)',
              marginTop: 'clamp(14px, 1.4vw, 24px)',
              marginBottom: 0,
              lineHeight: 1.4,
            }}
          >
            You found the secret. Click any title to play.
          </p>

          {/* 游戏菜单 */}
          <div
            id="games"
            style={{
              marginTop: 'clamp(38px, 4.6vw, 82px)',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(10px, 0.9vw, 16px)',
            }}
          >
            {games.map((game, i) => (
              <a
                key={game.id}
                href={game.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  textDecoration: 'none',
                  fontFamily: FONT_MONO,
                  fontWeight: 400,
                  fontSize: 'clamp(12px, 0.9vw, 16px)',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.82)',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  padding: 'clamp(13px, 1.2vw, 20px) clamp(18px, 1.6vw, 26px)',
                  transition: 'background 0.25s ease, color 0.25s ease',
                  animation: `eg-fade-up 0.5s cubic-bezier(0.16,1,0.3,1) ${180 + i * 70}ms both`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.09)'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.82)'
                }}
              >
                <Gamepad2 size={16} style={{ flexShrink: 0, opacity: 0.6 }} />
                <span style={{ flex: 1 }}>{game.title}</span>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8em' }}>0{i + 1}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ===== 底部 legal ===== */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.14)',
          padding: 'clamp(18px, 1.7vw, 30px) clamp(20px, 5vw, 100px)',
          paddingBottom: 'max(clamp(18px, 1.7vw, 30px), env(safe-area-inset-bottom))',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 300,
            fontSize: 'clamp(12px, 0.82vw, 16px)',
            color: 'rgba(255,255,255,0.62)',
            lineHeight: 1.5,
          }}
        >
          You unlocked the secret of Etta's vault. Return anytime by clicking the logo 10 times.
        </span>
      </footer>
    </div>
  )
}
