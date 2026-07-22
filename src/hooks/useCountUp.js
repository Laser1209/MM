import { useRef, useState, useEffect } from 'react'

/**
 * Count-up animation hook using requestAnimationFrame.
 * @param {number} end - target value
 * @param {number} duration - ms duration (default 1500)
 * @param {boolean} start - whether to start the animation
 * @returns current displayed number
 */
export default function useCountUp(end, duration = 1500, start = true) {
  const [count, setCount] = useState(0)
  const frameRef = useRef(null)
  const startTimeRef = useRef(null)

  useEffect(() => {
    if (!start) return

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

    const animate = (timestamp) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)
      setCount(Math.round(eased * end))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      startTimeRef.current = null
    }
  }, [end, duration, start])

  return count
}
