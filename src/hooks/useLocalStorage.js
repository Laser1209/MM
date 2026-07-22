import { useState, useEffect, useRef } from 'react'

/**
 * localStorage hook with JSON serialization.
 * Supports functional updates using the latest stored value (not a stale closure).
 */
export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  // Keep a ref in sync so functional updaters always see the latest value
  const latestRef = useRef(storedValue)
  latestRef.current = storedValue

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(latestRef.current) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    const handler = (e) => {
      if (e.key === key) {
        try {
          setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue)
        } catch {
          /* ignore */
        }
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [key, initialValue])

  return [storedValue, setValue]
}
