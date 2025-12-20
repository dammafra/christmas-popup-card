import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import { DoubleSide, InstancedMesh, MathUtils, Object3D } from 'three'

type Particle = {
  x: number
  y: number
  z: number
  speed: number

  rotationX: number
  rotationY: number
  rotationZ: number
  spinSpeedX: number
  spinSpeedZ: number

  scale: number

  swayPhase: number
  swayFreq: number
  swayAmp: number
}

interface SnowProps {
  count?: number
}

export function Snow({ count = 500 }: SnowProps) {
  const mesh = useRef<InstancedMesh>(null!)
  const texture = useTexture('/textures/snowflake.png')
  const dummy = useMemo(() => new Object3D(), [])

  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: count }, () => {
      const scale = MathUtils.randFloat(0.4, 1.8)

      //  speed based on dimension: larger flakes fall faster, smaller flakes fall slower
      const baseSpeed = Math.random() * 0.2 + 0.1
      const speed = baseSpeed * (scale * 0.5 + 0.5)

      return {
        x: Math.random() * 20 - 10,
        y: Math.random() * 20 - 10,
        z: Math.random() * 20 - 10,

        speed,
        scale,

        rotationX: Math.random() * Math.PI * 2,
        rotationY: Math.random() * Math.PI * 2,
        rotationZ: Math.random() * Math.PI * 2,
        spinSpeedX: (Math.random() - 0.5) * 2.5,
        spinSpeedZ: (Math.random() - 0.5) * 5,

        swayPhase: Math.random() * Math.PI * 2,
        swayFreq: Math.random() * 2 + 0.5,
        swayAmp: Math.random() * 0.2,
      }
    }),
  )

  useFrame((state, delta) => {
    if (!mesh.current) return

    const t = state.clock.getElapsedTime()

    particles.forEach((particle, i) => {
      particle.y -= particle.speed * delta

      if (particle.y < -10) {
        particle.y = 10
        particle.x = Math.random() * 20 - 10
        particle.z = Math.random() * 20 - 10
      }

      const xOffset = Math.sin(t * particle.swayFreq + particle.swayPhase) * particle.swayAmp
      dummy.position.set(particle.x + xOffset, particle.y, particle.z)

      particle.rotationX += particle.spinSpeedX * delta
      particle.rotationZ += particle.spinSpeedZ * delta
      particle.rotationY = Math.sin(t * particle.swayFreq)
      dummy.rotation.set(particle.rotationX, particle.rotationY, particle.rotationZ)

      // 3. Apply scale
      dummy.scale.set(particle.scale, particle.scale, particle.scale)

      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })

    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[0.1, 0.1]} />
      <meshBasicMaterial
        map={texture}
        alphaMap={texture}
        transparent
        depthWrite={false}
        opacity={0.8}
        side={DoubleSide}
      />
    </instancedMesh>
  )
}

useTexture.preload('/textures/snowflake.png')
