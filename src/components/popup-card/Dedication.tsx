import { useEffect, useMemo, useState } from 'react'
import { MathUtils } from 'three'

import { HandwrittenText } from '@components/helpers'
import { Phase, useDirection } from '@stores'
import { randomOneOf, safeJsonParse } from '@utils'

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
        safeJsonParse(atob(location.search.substring(1)), {
          dedication: randomOneOf(DEDICATIONS),
        }).dedication,
      ),
    [],
  )

  useEffect(() => {
    if (phase === Phase.LOADING) return

    const timeout = setTimeout(() => setShowDedication(true), 500)
    return () => clearTimeout(timeout)
  }, [phase, setShowDedication])

  if (phase === Phase.LOADING) return

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
        speed={phase > Phase.DEDICATION ? 20 : 3}
      >
        {dedication}
      </HandwrittenText>
    )
  )
}
