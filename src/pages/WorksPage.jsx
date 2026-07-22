import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../components/intro/Navbar.jsx'
import CategoryNav from '../components/works/CategoryNav.jsx'
import SearchBar from '../components/works/SearchBar.jsx'
import WorkCard from '../components/works/WorkCard.jsx'
import { getAllWorks, getWorksByCategory, WorksData } from '../data/worksData.js'

export default function WorksPage({ onAIChat }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') || 'all')
  const [searchResults, setSearchResults] = useState(null)

  const allWorks = getAllWorks()

  const handleCategoryChange = useCallback((catId) => {
    setActiveCategory(catId)
    setSearchResults(null)
    if (catId === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ cat: catId })
    }
  }, [setSearchParams])

  // Sync category from URL
  useEffect(() => {
    const cat = searchParams.get('cat')
    if (cat && cat !== activeCategory) {
      setActiveCategory(cat)
    }
  }, [searchParams])

  // Determine which works to display
  let displayWorks
  if (searchResults !== null) {
    displayWorks = searchResults
  } else if (activeCategory === 'all') {
    displayWorks = allWorks
  } else {
    displayWorks = getWorksByCategory(activeCategory)
  }

  // Group by subcategory for display
  const groupedWorks = {}
  if (activeCategory !== 'all' && WorksData[activeCategory]?.categories) {
    // Has subcategories
    Object.entries(WorksData[activeCategory].categories).forEach(([subKey, sub]) => {
      groupedWorks[subKey] = {
        title: sub.title,
        works: sub.works,
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#070b0a]">
      <Navbar onAIChat={onAIChat} />

      <div className="pt-24 px-5 sm:px-8 lg:px-10 pb-24">
        {/* Header */}
        <div className="mb-8">
          <p
            className="mb-3 animate-fade-in"
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 700,
              fontSize: '11px',
              color: '#5ed29c',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            All Works
          </p>
          <h1
            className="animate-word-reveal mb-6"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 400,
              letterSpacing: '-0.05em',
              fontSize: 'clamp(40px, 7vw, 72px)',
              lineHeight: 1.1,
            }}
          >
            <span style={{ animationDelay: '0.1s' }}>作品</span>{' '}
            <span style={{ animationDelay: '0.2s', color: 'rgba(255,255,255,0.45)' }}>总览</span>
          </h1>
        </div>

        {/* Search bar */}
        <div className="mb-6 animate-fade-up delay-300">
          <SearchBar
            allWorks={allWorks}
            onResults={setSearchResults}
            onClear={() => setSearchResults(null)}
          />
        </div>

        {/* Category navigation */}
        <CategoryNav
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Results count */}
        <p className="text-white/40 text-xs mb-6">
          {displayWorks.length} 件作品
          {searchResults !== null && ` · 搜索结果`}
        </p>

        {/* Works grid */}
        {displayWorks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/30">
            <p className="text-sm">未找到匹配的作品</p>
          </div>
        ) : Object.keys(groupedWorks).length > 0 && searchResults === null ? (
          /* Display grouped by subcategory */
          <div className="space-y-12">
            {Object.entries(groupedWorks).map(([subKey, group]) => (
              <div key={subKey}>
                <h2
                  className="text-white/80 mb-4 text-lg"
                  style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.03em' }}
                >
                  {group.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {group.works.map((work, index) => (
                    <WorkCard key={work.id} work={work} index={index} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Flat grid display */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayWorks.map((work, index) => (
              <WorkCard key={work.id} work={work} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
