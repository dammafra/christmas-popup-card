import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState, type JSX } from 'react'
import { Vector3 } from 'three'

// --- Constants ---
const FONT_URL = '/fonts/satisfy.vara.json' // Ensure this path is correct
const SCALE = 0.04
const SAMPLE_RESOLUTION = 1
const PARSE_TIME_LIMIT_MS = 12 // Yield to main thread every 12ms

interface VaraGlyph {
  paths: { mx: number; my: number; d: string; dy: number }[]
  w: number
}

interface VaraFontData {
  c: Record<string, VaraGlyph>
}

// --- Hook: Async/Chunked Parsing ---

interface VaraFontOptions {
  letterSpacing: number
  spaceWidth: number
  maxWidth: number
  textAlign: 'left' | 'center' | 'right'
  lineHeight: number
  center: boolean
}

function useVaraFont(text: string, options: VaraFontOptions) {
  const [fontData, setFontData] = useState<VaraFontData | null>(null)
  const [strokes, setStrokes] = useState<Vector3[][]>([])
  const [isParsing, setIsParsing] = useState(false)

  // 1. Load Font
  useEffect(() => {
    fetch(FONT_URL)
      .then(res => (res.ok ? res.json() : Promise.reject('Failed to load font')))
      .then(setFontData)
      .catch(console.error)
  }, [])

  // 2. Parse Text in Chunks (Time Slicing)
  useEffect(() => {
    if (!fontData || !text) {
      setStrokes([])
      return
    }

    let isCancelled = false
    setIsParsing(true)

    // Reusable element
    const pathElem = document.createElementNS('http://www.w3.org/2000/svg', 'path')

    const parseGlyph = (glyph: VaraGlyph) => {
      const paths: Vector3[][] = []
      let minX = Infinity
      let maxX = -Infinity

      if (!glyph.paths) return { paths, minX, maxX }

      glyph.paths.forEach(p => {
        pathElem.setAttribute('d', p.d)
        const len = pathElem.getTotalLength()
        if (len <= 0) return

        const points: Vector3[] = []
        // Reduce resolution slightly for very long texts if needed
        const sampleCount = Math.ceil(len / SAMPLE_RESOLUTION) + 1

        for (let i = 0; i <= sampleCount; i++) {
          const pt = pathElem.getPointAtLength((i / sampleCount) * len)
          const x = ((p.mx || 0) + pt.x) * SCALE
          const y = -((p.dy || 0) + pt.y) * SCALE
          points.push(new Vector3(x, y, 0))

          if (x < minX) minX = x
          if (x > maxX) maxX = x
        }
        paths.push(points)
      })
      return { paths, minX, maxX }
    }

    const generate = async () => {
      // Metrics state
      const lines: { strokes: Vector3[][]; width: number }[] = []
      let currentLineStrokes: Vector3[][] = []
      let currentLineX = 0

      const paragraphs = text.split('\n')
      let loopStartTime = performance.now()

      // --- Loop through text ---
      for (const paragraph of paragraphs) {
        const words = paragraph.split(' ')

        for (const word of words) {
          // Check time budget - if exceeded, wait for next frame
          if (performance.now() - loopStartTime > PARSE_TIME_LIMIT_MS) {
            await new Promise(resolve => setTimeout(resolve, 0))
            if (isCancelled) return
            loopStartTime = performance.now()
          }

          const wordStrokes: Vector3[][] = []
          let wordX = 0

          for (const char of word) {
            const glyph = fontData.c[char.charCodeAt(0)] || fontData.c['63']
            if (!glyph) continue

            const { paths, minX, maxX } = parseGlyph(glyph)

            if (paths.length > 0 && minX !== Infinity) {
              const shiftX = wordX - minX
              paths.forEach(pts => {
                wordStrokes.push(pts.map(p => new Vector3(p.x + shiftX, p.y, 0)))
              })
              const width = maxX - minX
              wordX += (width > 0 ? width : 10 * SCALE) + options.letterSpacing * SCALE
            } else {
              wordX += 10 * SCALE + options.letterSpacing * SCALE
            }
          }

          // Word Wrap
          const spaceSize = currentLineX === 0 ? 0 : options.spaceWidth * SCALE
          const fitsOnLine =
            options.maxWidth === Infinity || currentLineX + spaceSize + wordX <= options.maxWidth

          if (!fitsOnLine && currentLineX > 0) {
            lines.push({ strokes: currentLineStrokes, width: currentLineX })
            currentLineStrokes = []
            currentLineX = 0
            wordStrokes.forEach(s => currentLineStrokes.push(s))
            currentLineX = wordX
          } else {
            const startX = currentLineX + spaceSize
            wordStrokes.forEach(s => {
              currentLineStrokes.push(s.map(p => new Vector3(p.x + startX, p.y, 0)))
            })
            currentLineX += spaceSize + wordX
          }
        }
        lines.push({ strokes: currentLineStrokes, width: currentLineX })
        currentLineStrokes = []
        currentLineX = 0
      }

      // --- Alignment & Anchoring ---
      // (This part is fast enough to run synchronously usually)
      const refWidth =
        options.maxWidth === Infinity ? Math.max(...lines.map(l => l.width)) : options.maxWidth

      const tempStrokes: Vector3[][] = []
      const bounds = {
        min: new Vector3(Infinity, Infinity, Infinity),
        max: new Vector3(-Infinity, -Infinity, -Infinity),
      }

      lines.forEach((line, i) => {
        const lineYBase = -i * options.lineHeight
        let lineXBase = 0

        if (options.textAlign === 'center') lineXBase = (refWidth - line.width) / 2
        else if (options.textAlign === 'right') lineXBase = refWidth - line.width

        line.strokes.forEach(stroke => {
          const alignedStroke = stroke.map(p => {
            const v = new Vector3(p.x + lineXBase, p.y + lineYBase, 0)
            bounds.min.min(v)
            bounds.max.max(v)
            return v
          })
          tempStrokes.push(alignedStroke)
        })
      })

      if (tempStrokes.length === 0) {
        if (!isCancelled) {
          setStrokes([])
          setIsParsing(false)
        }
        return
      }

      const finalStrokes: Vector3[][] = []
      const globalOffset = new Vector3()

      if (options.center) {
        const center = new Vector3().addVectors(bounds.min, bounds.max).multiplyScalar(0.5)
        globalOffset.copy(center).negate()
      } else {
        globalOffset.set(-bounds.min.x, -bounds.max.y, 0)
      }

      tempStrokes.forEach(stroke => {
        finalStrokes.push(stroke.map(p => new Vector3().addVectors(p, globalOffset)))
      })

      if (!isCancelled) {
        setStrokes(finalStrokes)
        setIsParsing(false)
      }
    }

    generate()

    return () => {
      isCancelled = true
    }
  }, [
    fontData,
    text,
    options.letterSpacing,
    options.spaceWidth,
    options.maxWidth,
    options.textAlign,
    options.lineHeight,
    options.center,
  ])

  return { strokes, isParsing }
}

// --- Render Component: Optimized ---

interface HandwrittenTextContentProps {
  strokes: Vector3[][]
  color: string
  lineWidth: number
  speed: number
  onResolve?: () => void
}

function HandwrittenTextContent({
  strokes,
  color,
  lineWidth,
  speed,
  onResolve,
}: HandwrittenTextContentProps) {
  const [progress, setProgress] = useState(0)
  const resolvedRef = useRef(false)

  const totalPoints = useMemo(() => strokes.reduce((acc, s) => acc + s.length, 0), [strokes])

  useFrame((_, delta) => {
    if (totalPoints > 0 && progress < 1) {
      const increment = (speed * delta) / totalPoints
      const val = Math.min(progress + increment, 1)
      setProgress(val)

      if (val >= 1 && !resolvedRef.current) {
        resolvedRef.current = true
        onResolve?.()
      }
    }
  })

  if (!strokes.length) return null

  // Calculate global point count to draw
  const pointsToDraw = Math.floor(totalPoints * progress)

  // Pre-calculating offsets is fast, but we can memoize if really needed.
  // The map below is where the performance gain lives.
  let accumulatedPoints = 0

  return (
    <>
      {strokes.map((pts, i) => {
        const start = accumulatedPoints
        const end = start + pts.length
        accumulatedPoints = end

        // Optimization 1: Skip future lines completely
        if (pointsToDraw < start) return null

        // Optimization 2: Don't slice fully visible lines!
        // Passing the original 'pts' reference prevents creating new arrays.
        if (pointsToDraw >= end) {
          return <Line key={i} points={pts} color={color} lineWidth={lineWidth} worldUnits />
        }

        // Only slice the specific line currently being animated
        const drawCount = pointsToDraw - start
        if (drawCount < 2) return null

        return (
          <Line
            key={i}
            points={pts.slice(0, drawCount)}
            color={color}
            lineWidth={lineWidth}
            worldUnits
          />
        )
      })}
    </>
  )
}

// --- Main Component ---

type HandwrittenTextProps = Partial<VaraFontOptions> &
  Partial<Omit<HandwrittenTextContentProps, 'strokes'>> &
  JSX.IntrinsicElements['group'] & {
    children: string
    center?: boolean
  }

export function HandwrittenText({
  children,
  color = 'black',
  lineWidth = 1,
  speed = 3,
  letterSpacing = 0,
  spaceWidth = 10,
  maxWidth = Infinity,
  textAlign = 'left',
  lineHeight = 1,
  center = false,
  onResolve,
  ...props
}: HandwrittenTextProps) {
  const {
    strokes,
    //isParsing
  } = useVaraFont(children, {
    letterSpacing,
    spaceWidth,
    maxWidth,
    textAlign,
    lineHeight,
    center,
  })

  // Optional: You can render a loading state here if isParsing is true

  return (
    <group {...props}>
      <HandwrittenTextContent
        // Reset key when strokes change to restart animation
        key={strokes.length}
        strokes={strokes}
        color={color}
        lineWidth={lineWidth}
        speed={speed * 100} // Adjust scale as needed
        onResolve={onResolve}
      />
    </group>
  )
}
