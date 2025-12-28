import { a, config, useTransition } from '@react-spring/three'
import { useEffect, useState } from 'react'
import { MathUtils } from 'three'

import { HandwrittenText } from '@components/helpers'
import { Phase, useDirection } from '@stores'

export function Loading() {
  const phase = useDirection(s => s.phase)
  const [speed, setSpeed] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (phase === Phase.LOADING) setSpeed(2)
    }, 1000)

    return () => clearTimeout(timeout)
  })

  const transition = useTransition(phase, {
    from: { positionY: 0, opacity: 0 },
    enter: { positionY: 0, opacity: 1 },
    leave: { positionY: -1, opacity: 0 },
    config: config.molasses,
  })

  return transition(
    (spring, phase) =>
      phase === Phase.LOADING && (
        <a.group position-y={spring.positionY}>
          <mesh scale={[3.66, 0.08, 5.14]}>
            <boxGeometry />
            <a.meshStandardMaterial color="#C1351F" transparent opacity={spring.opacity} />
          </mesh>

          <HandwrittenText
            position-y={0.05}
            rotation-x={MathUtils.degToRad(-90)}
            lineWidth={0.015}
            scale={0.2}
            speed={speed}
            center
          >
            Loading
          </HandwrittenText>
        </a.group>
      ),
  )
}
