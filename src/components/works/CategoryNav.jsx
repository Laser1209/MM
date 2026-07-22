import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, Palette, Clapperboard, Box, Code2, Brain } from 'lucide-react'

const CATEGORIES = [
  { id: 'all', label: '全部', Icon: LayoutGrid },
  { id: 'aiDev', label: '人工智能', Icon: Brain },
  { id: 'graphicDesign', label: '平面设计', Icon: Palette },
  { id: 'videoEditing', label: '视频剪辑', Icon: Clapperboard },
  { id: 'modeling3d', label: '三维建模', Icon: Box },
  { id: 'basicLogic', label: '基础逻辑', Icon: Code2 },
]

export default function CategoryNav({ activeCategory, onCategoryChange }) {
  return (
    <nav className="flex flex-wrap gap-2 mb-8">
      {CATEGORIES.map((cat) => {
        const Icon = cat.Icon
        return (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all ${
              activeCategory === cat.id
                ? 'bg-[#5ed29c] text-[#070b0a] font-bold'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
            style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px' }}
          >
            <Icon size={14} strokeWidth={1.5} />
            {cat.label}
          </button>
        )
      })}
    </nav>
  )
}
