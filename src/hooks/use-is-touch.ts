import { useEffect, useState } from 'react'

export function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)')
    setIsTouch(mediaQuery.matches)

    function handleChange(e: MediaQueryListEvent) {
      setIsTouch(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return isTouch
}
