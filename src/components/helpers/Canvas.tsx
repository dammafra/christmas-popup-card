import { Canvas as R3FCanvas, useThree, type CanvasProps } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'

// See:
// - https://github.com/pmndrs/drei/issues/720
// - https://github.com/IsaacUA/drei-html-fix/blob/main/src/components/CanvasWrapper.tsx
export function Canvas({ children, ...props }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null!)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({
        width: Math.round(width % 2 !== 0 ? width + 1 : width),
        height: Math.round(height % 2 !== 0 ? height + 1 : height),
      })
    })

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
      }}
    >
      <R3FCanvas style={{ width: size.width, height: size.height }} {...props}>
        <InvalidateOnResize />
        {children}
      </R3FCanvas>
    </div>
  )
}

const InvalidateOnResize = () => {
  const invalidate = useThree(s => s.invalidate)

  useEffect(() => {
    const handle = () => invalidate()
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [invalidate])

  return null
}
