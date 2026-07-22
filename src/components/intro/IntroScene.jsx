import { useEffect, useRef } from 'react'
import VideoBackground from './VideoBackground.jsx'
import GridLines from './GridLines.jsx'
import CentralGlow from './CentralGlow.jsx'
import LiquidGlassCard from './LiquidGlassCard.jsx'
import HeroContent from './HeroContent.jsx'
import FloatingLabels from './FloatingLabels.jsx'
import Navbar from './Navbar.jsx'
import './IntroScene.css'

export default function IntroScene({ onAIChat }) {
  const sceneRef = useRef(null)

  // The intro scene stays in the DOM as the permanent hero section
  return (
    <section
      ref={sceneRef}
      className="relative w-full min-h-screen overflow-hidden bg-[#070b0a]"
    >
      {/* Background video with overlays */}
      <VideoBackground />

      {/* Grid lines */}
      <GridLines />

      {/* Central glow */}
      <CentralGlow />

      {/* Navbar */}
      <Navbar onAIChat={onAIChat} />

      {/* Hero content center */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-20">
        {/* Liquid Glass Card above headline */}
        <LiquidGlassCard />

        {/* Hero content */}
        <HeroContent />
      </div>

      {/* Binary stream decoration */}
      <div className="absolute bottom-0 left-0 right-0 binary-stream py-2">
        <span className="binary-stream-inner">
          01001000 01100101 01101100 01101100 01101111 00100000 01001001 00100000 01100001 01101101 00100000 01000101 01110100 01110100 01100001 00100000 01000011 01110010 01100101 01100001 01110100 01101001 01110110 01100101 00100000 01000100 01100101 01110110 01100101 01101100 01101111 01110000 01100101 01110010 00001010
          01001000 01100101 01101100 01101100 01101111 00100000 01001001 00100000 01100001 01101101 00100000 01000101 01110100 01110100 01100001 00100000 01000011 01110010 01100101 01100001 01110100 01101001 01110110 01100101 00100000 01000100 01100101 01110110 01100101 01101100 01101111 01110000 01100101 01110010 00001010
        </span>
      </div>

      {/* Floating labels (anchor labels, guide links, hover tips) */}
      <FloatingLabels
        onNavigate={(path) => {
          window.location.hash = path
        }}
        onAIChat={onAIChat}
      />
    </section>
  )
}
