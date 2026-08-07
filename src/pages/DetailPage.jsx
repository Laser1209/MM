import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ExternalLink, Play, Github, Globe,
  Monitor, Briefcase, Shield, Heart, Bell, RefreshCw,
  Zap, Network, Sparkles, KeyRound, FileDown, Crown,
  Volume2, BookOpen, Headphones, Clapperboard, MessageSquare, Leaf, ClipboardList, FileText,
  Siren, Activity, Clock, Truck, Rocket, GitMerge, Radio, Map,
  Landmark, Bot, CreditCard, Trophy, Palette, PenTool, Feather, Music, Frame,
  Minimize2, Brush, Search, LayoutGrid, TrendingUp, Film, Box, Sun,
  MousePointer, Scroll, Target, Moon, Smartphone, Gamepad2, Apple, ChartLine,
  Users, Award, Bomb, Flag, Layers, Undo2, MoveVertical, StepForward, Crosshair, Workflow,
} from 'lucide-react'
import Navbar from '../components/intro/Navbar.jsx'
import { findWorkById, getAllWorks } from '../data/worksData.js'
import { WORK_DETAILS } from '../data/workDetails.js'
import { asset } from '../config/siteConfig.js'
import useInView from '../hooks/useInView.js'

const ICONS = {
  Monitor, Briefcase, Shield, Heart, Bell, RefreshCw,
  Zap, Network, Sparkles, KeyRound, FileDown, Crown,
  Volume2, BookOpen, Headphones, Clapperboard, MessageSquare, Leaf, ClipboardList, FileText,
  Siren, Activity, Clock, Truck, Rocket, GitMerge, Radio, Map,
  Landmark, Bot, CreditCard, Trophy, Palette, PenTool, Feather, Music, Frame,
  Minimize2, Brush, Search, LayoutGrid, TrendingUp, Film, Box, Sun,
  MousePointer, Scroll, Target, Moon, Smartphone, Gamepad2, Apple, ChartLine,
  Users, Award, Bomb, Flag, Layers, Undo2, MoveVertical, StepForward, Crosshair, Workflow,
}

export default function DetailPage({ onAIChat }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const work = findWorkById(id)
  const detail = WORK_DETAILS[id]
  const [heroRef, heroInView] = useInView({ threshold: 0.1 })
  const [mediaRef, mediaInView] = useInView({ threshold: 0.1 })
  const [bodyRef, bodyInView] = useInView({ threshold: 0.05 })

  if (!work) {
    return (
      <div className="min-h-screen bg-[#070b0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 mb-4">作品未找到</p>
          <button
            onClick={() => navigate('/works')}
            className="text-[#5ed29c] text-sm underline"
          >
            返回作品列表
          </button>
        </div>
      </div>
    )
  }

  const isVideo = work.externalLink && work.externalLink.endsWith('.mp4')
  const isPlayable = work.externalLink && work.externalLink.endsWith('.html')
  const githubUrl = detail?.links?.github || (work.externalLink && /^https?:\/\//.test(work.externalLink) ? work.externalLink : '')
  const previewUrl = work.previewUrl || detail?.links?.preview || ''
  const gallery = detail?.gallery || work.gallery || []
  const fallbackTech = work.tags || []

  // Related works (same category, excluding current & hidden games)
  const allWorks = getAllWorks()
  const relatedWorks = allWorks
    .filter((w) => w.category === work.category && w.id !== work.id && !w.easterEgg)
    .slice(0, 4)

  const sectionClass = (inView) => (inView ? 'animate-fade-up' : 'opacity-0')

  return (
    <div className="min-h-screen bg-[#070b0a]">
      <Navbar onAIChat={onAIChat} />

      <div className="pt-24 px-5 sm:px-8 lg:px-10 pb-24">
        {/* Back button */}
        <button
          onClick={() => navigate('/works')}
          className="flex items-center gap-2 text-white/50 hover:text-[#5ed29c] transition-colors mb-8 animate-fade-in"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">返回作品列表</span>
        </button>

        {/* ===== Hero ===== */}
        <div ref={heroRef} className={`mb-10 ${sectionClass(heroInView)}`}>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {work.tags && work.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-full text-[10px] uppercase tracking-wide bg-white/5 text-white/40"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1
            className="mb-4"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 400,
              letterSpacing: '-0.05em',
              fontSize: 'clamp(32px, 6vw, 56px)',
              lineHeight: 1.1,
            }}
          >
            {work.title}
          </h1>
          {work.description && (
            <p
              className="text-white/60 max-w-[700px]"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', lineHeight: 1.7 }}
            >
              {work.description}
            </p>
          )}

          {/* Action buttons */}
          {(githubUrl || previewUrl || isPlayable) && (
            <div className="flex flex-wrap gap-3 mt-8">
              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold uppercase tracking-wide transition-all hover:scale-105"
                  style={{ background: '#5ed29c', color: '#070b0a', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}
                >
                  <Globe size={15} /> 访问主页
                </a>
              )}
              {isPlayable && (
                <a
                  href={work.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold uppercase tracking-wide transition-all hover:scale-105"
                  style={{ background: '#5ed29c', color: '#070b0a', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}
                >
                  <Play size={15} fill="#070b0a" /> 在线体验
                </a>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold uppercase tracking-wide transition-all hover:scale-105"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.15)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                  }}
                >
                  <Github size={15} /> 查看源码
                </a>
              )}
            </div>
          )}
        </div>

        {/* ===== Main visual ===== */}
        <div ref={mediaRef} className={`mb-16 ${sectionClass(mediaInView)}`}>
          {isVideo ? (
            <div className="rounded-xl overflow-hidden bg-black">
              <video src={work.externalLink} controls className="w-full max-h-[70vh] object-contain" />
            </div>
          ) : isPlayable ? (
            <div className="rounded-xl overflow-hidden border border-white/10">
              <iframe src={work.externalLink} title={work.title} className="w-full h-[70vh]" style={{ border: 'none' }} />
            </div>
          ) : work.thumbnail ? (
            <div className="rounded-xl overflow-hidden bg-black/30">
              <img src={work.thumbnail} alt={work.title} className="w-full max-h-[70vh] object-contain" />
            </div>
          ) : null}
        </div>

        {/* ===== Body content ===== */}
        <div ref={bodyRef} className={`space-y-16 ${sectionClass(bodyInView)}`}>
          {/* Stats */}
          {detail?.stats && detail.stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {detail.stats.map((s, i) => (
                <div key={i} className="rounded-xl p-5 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-white/40 text-xs mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>{s.label}</p>
                  <p className="text-[#5ed29c] text-xl font-semibold" style={{ fontFamily: 'DM Sans, sans-serif' }}>{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Overview */}
          {detail?.overview && detail.overview.length > 0 && (
            <section>
              <h2 className="mb-5 text-white/80 text-xl" style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.03em' }}>
                项目概述
              </h2>
              <div className="space-y-4 max-w-[720px]">
                {detail.overview.map((p, i) => (
                  <p key={i} className="text-white/60" style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', lineHeight: 1.8 }}>
                    {p}
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* Features */}
          {detail?.features && detail.features.length > 0 && (
            <section>
              <h2 className="mb-6 text-white/80 text-xl" style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.03em' }}>
                功能亮点
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {detail.features.map((f, i) => {
                  const Icon = ICONS[f.icon] || Sparkles
                  return (
                    <div key={i} className="rounded-xl p-5 transition-all hover:scale-[1.02]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(94,210,156,0.12)' }}>
                        <Icon size={18} className="text-[#5ed29c]" />
                      </div>
                      <h3 className="text-white text-sm font-semibold mb-1.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>{f.title}</h3>
                      <p className="text-white/50 text-xs leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>{f.text}</p>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Tech stack */}
          {(detail?.techStack?.length > 0 || fallbackTech.length > 0) && (
            <section>
              <h2 className="mb-6 text-white/80 text-xl" style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.03em' }}>
                技术栈
              </h2>
              <div className="flex flex-wrap gap-2">
                {(detail?.techStack?.length > 0 ? detail.techStack : fallbackTech).map((t, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(94,210,156,0.1)', color: '#5ed29c', fontFamily: 'Inter, sans-serif' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Gallery */}
          {gallery.length > 0 && (
            <section>
              <h2 className="mb-6 text-white/80 text-xl" style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.03em' }}>
                项目截图
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {gallery.map((img, i) => (
                  <div key={i} className="rounded-lg overflow-hidden bg-black/40 border border-white/10">
                    <img src={asset(img)} alt={`${work.title} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ===== Related works ===== */}
        {relatedWorks.length > 0 && (
          <div className="mt-20">
            <h2
              className="mb-6 text-white/80 text-xl"
              style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.03em' }}
            >
              相关作品
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedWorks.map((rw) => (
                <button
                  key={rw.id}
                  onClick={() => navigate(`/works/${rw.id}`)}
                  className="group text-left rounded-xl overflow-hidden transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-black/30">
                    {rw.thumbnail ? (
                      <img src={rw.thumbnail} alt={rw.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">预览</div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-white text-xs truncate">{rw.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
