import { useEffect } from 'react'

function createDoubleTapPreventer(timeout: number) {
  let dblTapTimer: number | undefined
  let dblTapPressed = false

  return function (e: TouchEvent) {
    clearTimeout(dblTapTimer)
    if (dblTapPressed) {
      e.preventDefault()
      dblTapPressed = false
    } else {
      dblTapPressed = true
      dblTapTimer = window.setTimeout(() => {
        dblTapPressed = false
      }, timeout)
    }
  }
}

interface DoubleTapPreventerProps {
  timeout?: number
}

export function DoubleTapPreventer({ timeout = 500 }: DoubleTapPreventerProps) {
  useEffect(() => {
    const handler = createDoubleTapPreventer(timeout)
    document.body.addEventListener('touchstart', handler, { passive: false })
    return () => document.body.removeEventListener('touchstart', handler)
  }, [timeout])

  return null
}
