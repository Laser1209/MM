import { pinyin } from 'pinyin-pro'

/**
 * Pinyin-aware fuzzy search for works.
 * Matches against title, description, tags — supports Chinese, pinyin, and mixed input.
 */
export function searchWorks(query, works) {
  if (!query || !query.trim()) return works

  const q = query.trim().toLowerCase()

  return works.filter((work) => {
    // Match against title (Chinese)
    if (work.title && work.title.toLowerCase().includes(q)) return true

    // Match against description
    if (work.description && work.description.toLowerCase().includes(q)) return true

    // Match against tags
    if (work.tags && work.tags.some((t) => t.toLowerCase().includes(q))) return true

    // Pinyin matching — convert title to pinyin (no tones, no spaces)
    if (work.title) {
      const titlePinyin = pinyin(work.title, { toneType: 'none', type: 'array' }).join('').toLowerCase()
      const titlePinyinSpaced = pinyin(work.title, { toneType: 'none', type: 'array' }).join(' ').toLowerCase()

      // Match full pinyin without spaces
      if (titlePinyin.includes(q)) return true

      // Match pinyin with spaces (for multi-word queries)
      if (titlePinyinSpaced.includes(q)) return true

      // Match first letters of each pinyin syllable (abbreviation)
      const abbreviation = pinyin(work.title, { toneType: 'none', type: 'array' })
        .map((s) => s[0])
        .join('')
        .toLowerCase()
      if (abbreviation.includes(q)) return true
    }

    return false
  })
}
