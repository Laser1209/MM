import { useRef, useState, useEffect } from 'react'

/**
 * Count-up animation hook using requestAnimationFrame with smooth easing.
 * @param {number} end - target value
 * @param {number} duration - ms duration (default 2000)
 * @param {boolean} start - whether to start the animation
 * @param {number} delay - ms delay before starting (default 0)
 * @returns current displayed number
 */
export default function useCountUp(end, duration = 2000, start = true, delay = 0) {
  const [count, setCount] = useState(0)
  const frameRef = useRef(null)
  const startTimeRef = useRef(null)
  const delayTimerRef = useRef(null)

  useEffect(() => {
    if (!start) {
      setCount(0)
      return
    }

    const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)

    const animate = (timestamp) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutExpo(progress)
      const current = eased * end
      setCount(progress < 0.1 ? Math.floor(current) : Math.round(current))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    const startAnimation = () => {
      frameRef.current = requestAnimationFrame(animate)
    }

    if (delay > 0) {
      delayTimerRef.current = setTimeout(startAnimation, delay)
    } else {
      startAnimation()
    }

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current)
      startTimeRef.current = null
    }
  }, [end, duration, start, delay])

  return count
}
