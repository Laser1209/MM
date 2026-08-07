import { useState, useCallback } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import WorksPage from './pages/WorksPage.jsx'
import DetailPage from './pages/DetailPage.jsx'
import EasterEggPage from './pages/EasterEggPage.jsx'
import CustomCursor from './components/layout/CustomCursor.jsx'
import AIChatPanel from './components/ai/AIChatPanel.jsx'
import ScrollToTop from './components/layout/ScrollToTop.jsx'

export default function App() {
  const [chatOpen, setChatOpen] = useState(false)
  const openChat = useCallback(() => setChatOpen(true), [])

  return (
    <HashRouter>
      <CustomCursor />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage onAIChat={openChat} />} />
        <Route path="/works" element={<WorksPage onAIChat={openChat} />} />
        <Route path="/works/:id" element={<DetailPage onAIChat={openChat} />} />
        <Route path="/easter-egg" element={<EasterEggPage />} />
      </Routes>
      <AIChatPanel open={chatOpen} onOpenChange={setChatOpen} />
    </HashRouter>
  )
}
