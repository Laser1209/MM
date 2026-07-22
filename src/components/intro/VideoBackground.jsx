import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import { SITE_CONFIG } from '../../config/siteConfig.js'

export default function VideoBackground() {
  const videoRef = useRef(null)
  const [videoFailed, setVideoFailed] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const src = SITE_CONFIG.introVideo

    let hls
    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: false })
      hls.loadSource(src)
      hls.attachMedia(video)

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setVideoFailed(true)
          hls.destroy()
        }
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS support
      video.src = src
      video.addEventListener('error', () => setVideoFailed(true))
    } else {
      setVideoFailed(true)
    }

    return () => {
      if (hls) hls.destroy()
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Fallback animated gradient background (always visible behind video) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(94, 210, 156, 0.08) 0%, transparent 50%), linear-gradient(135deg, #070b0a 0%, #0d1a14 50%, #070b0a 100%)',
        }}
      />

      {/* Video layer — hidden if failed */}
      {!videoFailed && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover relative z-10"
          style={{ opacity: 0.6 }}
        />
      )}

      {/* Bottom gradient for readability (subtle, only at very bottom) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #070b0a, transparent)',
        }}
      />
    </div>
  )
}
