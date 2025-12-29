import { useEffect, useState } from 'react'
import { MathUtils } from 'three'

import { HandwrittenText } from '@components/helpers'
import { Phase, useDirection } from '@stores'
import { safeJsonParse } from '@utils'

export function Dedication() {
  const phase = useDirection(s => s.phase)
  const [showDedication, setShowDedication] = useState(false)

  const dedication = safeJsonParse(atob(location.search.substring(1)), {
    dedication: 'For whoever this reaches',
  }).dedication

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
