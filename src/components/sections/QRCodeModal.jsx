import { X } from 'lucide-react'
import { SITE_CONFIG } from '../../config/siteConfig.js'

export default function QRCodeModal({ open, onClose }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#5ed29c] flex items-center justify-center text-[#070b0a] hover:scale-110 transition-transform"
        >
          <X size={16} />
        </button>
        <p
          className="text-center mb-4 text-white"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', letterSpacing: '-0.03em' }}
        >
          微信扫码联系
        </p>
        <img
          src={SITE_CONFIG.wechatQR}
          alt="WeChat QR Code"
          className="w-[200px] h-[200px] object-contain rounded-lg bg-white p-2"
        />
        <p
          className="text-center mt-4 text-white/50 text-xs"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {SITE_CONFIG.email}
        </p>
      </div>
    </div>
  )
}
