import { useEffect, useRef, useState } from 'react'

let mermaidReady = null
function getMermaid() {
  if (!mermaidReady) {
    mermaidReady = import('mermaid').then((m) => {
      m.default.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'strict',
      })
      return m.default
    })
  }
  return mermaidReady
}

let uidCounter = 0

export default function MermaidRenderer({ code }) {
  const ref = useRef(null)
  const [failed, setFailed] = useState('')

  useEffect(() => {
    let cancelled = false
    const id = `mermaid-${++uidCounter}`
    getMermaid()
      .then(async (mermaid) => {
        if (cancelled || !ref.current) return
        const { svg } = await mermaid.render(id, code)
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg
        }
      })
      .catch((e) => {
        if (!cancelled) setFailed(String(e && e.message ? e.message : e))
      })
    return () => {
      cancelled = true
    }
  }, [code])

  if (failed) {
    return (
      <pre style={{ margin: '0.4em 0', padding: '0.5em 0.7em', background: 'rgba(255,255,255,0.08)', borderRadius: 6, whiteSpace: 'pre-wrap', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
        {code}
      </pre>
    )
  }

  return (
    <div
      ref={ref}
      style={{
        margin: '0.4em 0',
        padding: '0.6em',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.1)',
        overflowX: 'auto',
      }}
    />
  )
}
