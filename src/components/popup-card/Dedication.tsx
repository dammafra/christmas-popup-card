import { useEffect, useMemo, useState } from 'react'
import { MathUtils } from 'three'

import { HandwrittenText } from '@components/helpers'
import { DirectionPhase, useDirection } from '@stores'
import { randomOneOf, safeDecode } from '@utils'

const DEDICATIONS = [
  'To the one reading this',
  'To whoever this reaches',
  'To anyone who finds this message',
  'To you',
]

export function Dedication() {
  const phase = useDirection(s => s.phase)
  const [showDedication, setShowDedication] = useState(false)

  const dedication = useMemo(
    () =>
      decodeURIComponent(
        safeDecode(location.search.substring(1), {
          dedication: import.meta.env.VITE_DEDICATION || randomOneOf(DEDICATIONS),
        }).dedication,
      ),
    [],
  )

  useEffect(() => {
    document.title = dedication
  }, [dedication])

  useEffect(() => {
    if (phase === DirectionPhase.LOADING) return

    const timeout = setTimeout(() => setShowDedication(true), 500)
    return () => clearTimeout(timeout)
  }, [phase, setShowDedication])

  if (phase === DirectionPhase.LOADING) return

  return (
    showDedication && (
      <HandwrittenText
        position={[1.83, 0.02, 0]}
        rotation-x={MathUtils.degToRad(-90)}
        lineWidth={0.01}
        scale={0.2}
        maxWidth={6}
        textAlign="center"
        center
        speed={phase > DirectionPhase.DEDICATION ? 20 : 3}
      >
        {dedication}
      </HandwrittenText>
    )
  )
}
