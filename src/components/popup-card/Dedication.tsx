import { animated } from '@react-spring/three'
import { useEffect, useState } from 'react'
import { MathUtils } from 'three'

import { HandwrittenText } from '@components/helpers'
import { Phase, useDirection } from '@stores'

export function Dedication() {
  const phase = useDirection(s => s.phase)
  const setPhase = useDirection(s => s.setPhase)

  const [showDedication, setShowDedication] = useState(false)
  const [showActions, setShowActions] = useState(false)

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
          onResolve={() => setTimeout(() => setShowActions(true), 500)}
        >
          To the one reading this
        </HandwrittenText>
      )}

      {phase === Phase.READY && showActions && (
        <group position={[0, -0.55, 0]} onClick={() => setPhase(Phase.OPENING)}>
          <mesh scale={[0.5, 0.25, 1]} position-y={0.01}>
            <planeGeometry />
            <animated.meshBasicMaterial transparent opacity={0} />
          </mesh>

          <HandwrittenText
            position-z={0.001}
            lineWidth={0.008}
            scale={0.1}
            maxWidth={6}
            textAlign="center"
            center
          >
            Read
          </HandwrittenText>
        </group>
      )}
    </group>
  )
}
