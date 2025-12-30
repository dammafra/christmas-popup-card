import { a, useSpring } from '@react-spring/three'
import { Billboard, GradientTexture, GradientType } from '@react-three/drei'

interface GlowProps {
  show: boolean
}

export function Glow({ show }: GlowProps) {
  const { opacity } = useSpring({
    from: { opacity: show ? 0 : 0.8 },
    to: { opacity: show ? 0.8 : 0 },
  })

  return (
    <Billboard>
      <mesh position-y={2} position-z={-5} scale={5}>
        <circleGeometry />
        <a.meshBasicMaterial transparent opacity={opacity}>
          <GradientTexture
            stops={[0, 1]}
            colors={['#e17100', 'black']}
            size={512}
            width={512}
            type={GradientType.Radial}
            innerCircleRadius={0}
            outerCircleRadius={200}
          />
        </a.meshBasicMaterial>
      </mesh>
    </Billboard>
  )
}
