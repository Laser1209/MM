import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { searchWorks } from '../../utils/pinyinSearch.js'

export default function SearchBar({ allWorks, onResults, onClear }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (query.trim()) {
      const results = searchWorks(query, allWorks)
      onResults(results)
    } else {
      onClear()
    }
  }, [query, allWorks, onResults, onClear])

  return (
    <div className="relative w-full max-w-[400px]">
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-full border transition-colors"
        style={{
          borderColor: focused ? '#5ed29c' : 'rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.03)',
        }}
      >
        <Search size={16} className="text-white/40 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="搜索作品 / Search works..."
          className="flex-1 bg-transparent outline-none text-white text-sm placeholder:text-white/30"
          style={{ fontFamily: 'Inter, sans-serif' }}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            className="text-white/40 hover:text-white/70"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
