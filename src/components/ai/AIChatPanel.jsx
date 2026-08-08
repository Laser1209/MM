import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { MessageCircle, X, Send, Trash2, ArrowRight, Sparkles } from 'lucide-react'
import { aiEngine } from '../../utils/aiEngine.js'
import { SITE_CONFIG } from '../../config/siteConfig.js'
import useLocalStorage from '../../hooks/useLocalStorage.js'
import MarkdownChart from './MarkdownChart.jsx'
import MermaidRenderer from './MermaidRenderer.jsx'

// Markdown 渲染——让 AI 回复中的加粗/列表/链接等格式正确展示（暗色主题适配）
const MARKDOWN_COMPONENTS = {
  a: ({ node, ...props }) => (
    <a {...props} target="_blank" rel="noopener noreferrer" style={{ color: '#5ed29c', textDecoration: 'underline' }} />
  ),
  p: ({ node, ...props }) => <p style={{ margin: '0.4em 0' }} {...props} />,
  ul: ({ node, ...props }) => (
    <ul style={{ margin: '0.4em 0', paddingLeft: '1.2em', listStyle: 'disc' }} {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol style={{ margin: '0.4em 0', paddingLeft: '1.2em', listStyle: 'decimal' }} {...props} />
  ),
  li: ({ node, ...props }) => <li style={{ margin: '0.2em 0' }} {...props} />,
  strong: ({ node, ...props }) => <strong style={{ color: '#fff', fontWeight: 600 }} {...props} />,
  em: ({ node, ...props }) => <em {...props} />,
  h1: ({ node, ...props }) => <h1 style={{ fontSize: '1.1em', fontWeight: 600, margin: '0.4em 0' }} {...props} />,
  h2: ({ node, ...props }) => <h2 style={{ fontSize: '1.05em', fontWeight: 600, margin: '0.4em 0' }} {...props} />,
  h3: ({ node, ...props }) => <h3 style={{ fontSize: '1em', fontWeight: 600, margin: '0.4em 0' }} {...props} />,
  code: ({ node, inline, ...props }) =>
    inline ? (
      <code
        style={{
          background: 'rgba(255,255,255,0.12)',
          padding: '0.1em 0.35em',
          borderRadius: 4,
          fontSize: '0.9em',
        }}
        {...props}
      />
    ) : (
      <code
        style={{
          display: 'block',
          background: 'rgba(255,255,255,0.08)',
          padding: '0.5em 0.7em',
          borderRadius: 6,
          margin: '0.4em 0',
          whiteSpace: 'pre-wrap',
        }}
        {...props}
      />
    ),
  pre: ({ children }) => {
    const child = Array.isArray(children) ? children[0] : children
    const cls = child && child.props ? child.props.className : ''
    const codeText = child && child.props ? child.props.children : ''
    const lang = String(cls || '').replace(/^language-/, '').toLowerCase()
    if (lang === 'mermaid') {
      return <MermaidRenderer code={String(codeText)} />
    }
    if (lang === 'echarts' || lang === 'chart') {
      return <MarkdownChart raw={String(codeText)} />
    }
    return <pre style={{ margin: '0.4em 0', padding: '0.5em 0.7em', background: 'rgba(255,255,255,0.08)', borderRadius: 6, overflowX: 'auto' }}>{children}</pre>
  },
}

// 欢迎初始页——尚未开始真正对话（或清空后回归）时展示，配色/字体与整体主题一致
function WelcomeView({ onPick }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center animate-fade-up">
      {/* 品牌头像 */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 animate-scale-in"
        style={{
          background: 'linear-gradient(135deg, #5ed29c, #2f9b6f)',
          boxShadow: '0 8px 30px rgba(94,210,156,0.35)',
        }}
      >
        <span className="text-[#070b0a] font-bold text-2xl" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          E
        </span>
      </div>

      <h2
        className="text-white text-lg font-bold mb-1.5"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        Hi，我是 <span style={{ color: '#5ed29c' }}>Etta</span>
      </h2>

      <p className="text-white/50 text-xs leading-relaxed mb-6 max-w-[260px]" style={{ fontFamily: 'Inter, sans-serif' }}>
        你的专属 AI 助手，随时为你解答作品、技术栈与合作方式。
      </p>

      {/* 快捷提问卡片 */}
      <div className="grid grid-cols-2 gap-2 w-full">
        {SITE_CONFIG.aiSuggestions.map((s) => (
          <button
            key={s.label}
            onClick={() => onPick(s)}
            className="group flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all hover:scale-[1.02] hover:border-[#5ed29c]/40"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <Sparkles size={12} className="text-[#5ed29c] flex-shrink-0 transition-transform group-hover:rotate-12" />
            <span className="block text-white/80 text-[11px] leading-snug min-w-0">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function AIChatPanel({ open: externalOpen, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = (val) => {
    if (onOpenChange) onOpenChange(val)
    else setInternalOpen(val)
  }
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useLocalStorage('etta-chat-history', [
    {
      role: 'assistant',
      content: '你好，我是 Etta，欢迎来到我主人的个人作品集。这里收录了我主人的平面设计、视频剪辑、三维建模和小游戏开发作品——你可以点击导航栏的 Works 浏览全部。有什么想了解的？',
    },
  ])
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const clearTimerRef = useRef(null)
  const [showDeleted, setShowDeleted] = useState(false)

  // 展示欢迎初始页：仅在仍处于初始问候语（唯一一条 assistant 消息）时显示，
  // 避免历史异常（如仅剩一条用户消息）时误显示欢迎页
  const showWelcome = messages.length === 1 && messages[0]?.role === 'assistant'

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  // 组件卸载时清除「已删除」气泡的定时器，避免卸载后仍触发 setState
  useEffect(() => {
    return () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current)
    }
  }, [])

  const handleSend = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || isTyping) return

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }])
    setInput('')
    setIsTyping(true)

    // Get AI response (may include an interface action / candidates)
    try {
      const res = await aiEngine.sendMessage(trimmed, location.pathname)
      const assistantMsg = {
        role: 'assistant',
        content: res.text,
        action: res.action || undefined,
        candidates: res.candidates?.length ? res.candidates : undefined,
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '抱歉，出了点问题，请稍后再试。' },
      ])
    } finally {
      setIsTyping(false)
    }
  }, [input, isTyping, setMessages])

  // 执行跳转：普通路由直接 navigate；首页分区则先回首页再滚动到目标
  const goToInterface = useCallback(
    (target) => {
      if (!target) return
      if (target.scrollTo) {
        navigate(target.route)
        setTimeout(() => {
          const el = document.getElementById(target.scrollTo)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 150)
      } else {
        navigate(target.route)
      }
    },
    [navigate]
  )

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClear = () => {
    aiEngine.clearHistory()
    setMessages([
      {
        role: 'assistant',
        content: '你好，我是 Etta，欢迎来到我主人的个人作品集。这里收录了我主人的平面设计、视频剪辑、三维建模和小游戏开发作品——你可以点击导航栏的 Works 浏览全部。有什么想了解的？',
      },
    ])
    // 弹出「已删除」气泡，短暂展示后消失，并回归到最一开始的欢迎初始页
    setShowDeleted(true)
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current)
    clearTimerRef.current = setTimeout(() => setShowDeleted(false), 1800)
  }

  const handleSuggestion = (suggestion) => {
    setInput(suggestion.query)
    inputRef.current?.focus()
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 animate-fade-in"
          style={{
            background: '#5ed29c',
            boxShadow: '0 4px 20px rgba(94, 210, 156, 0.4)',
          }}
        >
          <MessageCircle size={24} className="text-[#070b0a]" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-40 w-[calc(100vw-3rem)] sm:w-[380px] h-[500px] max-h-[calc(100vh-3rem)] flex flex-col rounded-2xl overflow-hidden animate-scale-in"
          style={{
            background: 'rgba(7, 11, 10, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#5ed29c] flex items-center justify-center">
                <span className="text-[#070b0a] font-bold text-xs">E</span>
              </div>
              <div>
                <p className="text-white text-sm font-bold" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  Etta AI
                </p>
                <p className="text-white/40 text-[10px]">在线对话</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                className="p-1.5 text-white/40 hover:text-white/70 transition-colors"
                title="清空对话"
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-white/40 hover:text-white/70 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {/* 「已删除」气泡：点击清空后短暂弹出，随后消失并回归欢迎页 */}
            {showDeleted && (
              <div className="flex justify-center animate-scale-in">
                <div
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] text-white/75"
                  style={{
                    background: 'rgba(94,210,156,0.12)',
                    border: '1px solid rgba(94,210,156,0.35)',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  <Trash2 size={11} className="text-[#5ed29c]" />
                  对话已删除，一切重新开始
                </div>
              </div>
            )}

            {showWelcome ? (
              /* 欢迎初始页：尚未开始真正对话时展示 */
              <WelcomeView onPick={handleSuggestion} />
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm min-w-0 ${
                      msg.role === 'user'
                        ? 'bg-[#5ed29c] text-[#070b0a] rounded-br-sm'
                        : 'bg-white/10 text-white/90 rounded-bl-sm'
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif', lineHeight: 1.5, fontSize: '13px' }}
                  >
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown components={MARKDOWN_COMPONENTS}>{msg.content}</ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                    {/* 动作卡片：AI 确定要跳转时渲染 */}
                    {msg.role === 'assistant' && msg.action && (
                      <button
                        onClick={() => goToInterface(msg.action)}
                        className="mt-2 w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all hover:scale-[1.02]"
                        style={{ background: 'rgba(94,210,156,0.12)', border: '1px solid rgba(94,210,156,0.25)' }}
                      >
                        {msg.action.thumbnail && (
                          <img
                            src={msg.action.thumbnail}
                            alt={msg.action.title}
                            className="w-11 h-11 rounded-md object-cover flex-shrink-0 bg-black/30"
                          />
                        )}
                        <span className="flex-1 min-w-0">
                          <span className="block text-white text-xs font-semibold truncate" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            {msg.action.title}
                          </span>
                          <span className="block text-[#5ed29c] text-[10px] mt-0.5">前往界面</span>
                        </span>
                        <ArrowRight size={14} className="text-[#5ed29c] flex-shrink-0" />
                      </button>
                    )}
                    {/* 候选列表：AI 拿不准时渲染，供用户选择 */}
                    {msg.role === 'assistant' && msg.candidates?.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {msg.candidates.map((cand) => (
                          <button
                            key={cand.id}
                            onClick={() => goToInterface(cand)}
                            className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition-colors hover:bg-white/10"
                            style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                          >
                            {cand.thumbnail && (
                              <img
                                src={cand.thumbnail}
                                alt={cand.title}
                                className="w-9 h-9 rounded-md object-cover flex-shrink-0 bg-black/30"
                              />
                            )}
                            <span className="flex-1 min-w-0">
                              <span className="block text-white text-[11px] font-medium truncate" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                                {cand.title}
                              </span>
                            </span>
                            <ArrowRight size={12} className="text-white/40 flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0s' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="px-4 py-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入消息..."
                disabled={isTyping}
                className="flex-1 bg-white/5 rounded-full px-4 py-2 text-white text-sm placeholder:text-white/30 outline-none disabled:opacity-50"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
                style={{ background: '#5ed29c' }}
              >
                <Send size={16} className="text-[#070b0a]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
