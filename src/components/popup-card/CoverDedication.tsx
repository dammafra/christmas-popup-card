import { MathUtils } from 'three'

import { HandwrittenText } from '@components/helpers'
import { CameraControlsImpl, useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'

export function CoverDedication() {
  const texture = useTexture('/textures/snowflake.png')
  const controls = useThree(s => s.controls)
  const dolly = 1

  useEffect(() => {
    const cameraControls = controls as CameraControlsImpl
    if (!cameraControls) return

    cameraControls.dollyTo(dolly, true)
  }, [dolly, controls])

  return (
    <group position={[1.83, 0.04, 0]} rotation-x={MathUtils.degToRad(-90)}>
      <HandwrittenText
        lineWidth={0.0125}
        scale={0.2}
        maxWidth={6}
        textAlign="center"
        center
        animate={false}
      >
        {`Holyday
          Wishes`}
      </HandwrittenText>
      <mesh scale={0.25} position={[-0.36, -0.09, 0]} rotation-z={MathUtils.degToRad(-45)}>
        <planeGeometry />
        <meshBasicMaterial
          map={texture}
          alphaMap={texture}
          transparent
          depthWrite={false}
          opacity={0.8}
          color={[3, 3, 3]}
        />
      </mesh>
    </group>
  )
}
