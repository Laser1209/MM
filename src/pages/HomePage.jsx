import { useState } from 'react'
import IntroScene from '../components/intro/IntroScene.jsx'
import About from '../components/sections/About.jsx'
import WorksPreview from '../components/sections/WorksPreview.jsx'
import Skills from '../components/sections/Skills.jsx'
import Contact from '../components/sections/Contact.jsx'
import ThreePanelFooter from '../components/sections/ThreePanelFooter.jsx'
import QRCodeModal from '../components/sections/QRCodeModal.jsx'

export default function HomePage({ onAIChat }) {
  const [qrOpen, setQrOpen] = useState(false)

  return (
    <div className="relative bg-[#070b0a]">
      {/* Intro Scene — permanent hero (Prompt A) */}
      <IntroScene onAIChat={onAIChat} />

      {/* Main page sections */}
      <About />
      <WorksPreview />
      <Skills />
      <Contact onQRClick={() => setQrOpen(true)} />

      {/* 3-panel footer strip (Prompt B design) */}
      <ThreePanelFooter />

      {/* QR Code modal */}
      <QRCodeModal open={qrOpen} onClose={() => setQrOpen(false)} />
    </div>
  )
}
