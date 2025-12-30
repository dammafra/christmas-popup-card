import { useEffect, useState } from 'react'

export function useVisualViewport() {
  const [viewport, setViewport] = useState({
    height: window.visualViewport?.height || window.innerHeight,
    offsetTop: window.visualViewport?.offsetTop || 0,
  })

  useEffect(() => {
    const visualViewport = window.visualViewport

    if (!visualViewport) return

    const onResize = () => {
      setViewport({
        height: visualViewport.height,
        offsetTop: visualViewport.offsetTop,
      })
    }

    visualViewport.addEventListener('resize', onResize)
    visualViewport.addEventListener('scroll', onResize)

    return () => {
      visualViewport.removeEventListener('resize', onResize)
      visualViewport.removeEventListener('scroll', onResize)
    }
  }, [])

  return viewport
}
