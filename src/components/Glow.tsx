import { Billboard, GradientTexture, GradientType } from '@react-three/drei'

export function Glow() {
  return (
    <Billboard>
      <mesh position-z={-5} scale={5}>
        <circleGeometry />
        <meshBasicMaterial>
          <GradientTexture
            stops={[0, 1]}
            colors={['#7b3306', 'black']}
            size={512}
            width={512}
            type={GradientType.Radial}
            innerCircleRadius={100}
            outerCircleRadius={250}
          />
        </meshBasicMaterial>
      </mesh>
    </Billboard>
  )
}
