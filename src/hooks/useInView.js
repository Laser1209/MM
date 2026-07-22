import { useRef, useState, useEffect } from 'react'

/**
 * IntersectionObserver hook for scroll-triggered animations.
 * Returns [ref, isInView].
 */
export default function useInView(options = {}) {
  const { threshold = 0.15, once = true, rootMargin = '0px' } = options
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) observer.unobserve(entry.target)
        } else if (!once) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once, rootMargin])

  return [ref, isInView]
}
