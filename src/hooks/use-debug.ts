import { useEffect, useState } from 'react'

export function useDebug() {
  const [debug, setDebug] = useState(
    import.meta.env.MODE === 'development' || window.location.hash === '#debug',
  )

  useEffect(() => {
    const handler = () => setDebug(window.location.hash === '#debug')
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  return debug
}
