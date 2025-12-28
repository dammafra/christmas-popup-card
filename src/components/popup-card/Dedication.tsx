import { useEffect, useState } from 'react'
import { MathUtils } from 'three'

import { HandwrittenText } from '@components/helpers'
import { Phase, useDirection } from '@stores'

export function Dedication() {
  const phase = useDirection(s => s.phase)
  const setPhase = useDirection(s => s.setPhase)

  const [showDedication, setShowDedication] = useState(false)

  useEffect(() => {
    if (phase === Phase.LOADING) return

    const timeout = setTimeout(() => setShowDedication(true), 500)
    return () => clearTimeout(timeout)
  }, [phase, setShowDedication])

  if (phase === Phase.LOADING) return

  return (
    <group position={[1.83, 0.02, 0]} rotation-x={MathUtils.degToRad(-90)}>
      {showDedication && (
        <HandwrittenText
          lineWidth={0.01}
          scale={0.2}
          maxWidth={6}
          textAlign="center"
          center
          onResolve={() => setTimeout(() => setPhase(Phase.READY), 500)}
        >
          To the one reading this
        </HandwrittenText>
      )}
    </group>
  )
}
