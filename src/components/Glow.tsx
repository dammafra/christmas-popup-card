import { a, useSpring } from '@react-spring/three'
import { Billboard, GradientTexture, GradientType } from '@react-three/drei'

export function Glow() {
  const { opacity } = useSpring({ from: { opacity: 0 }, to: { opacity: 0.8 }, delay: 1500 })

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
