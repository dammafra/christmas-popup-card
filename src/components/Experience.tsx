import { Canvas, Helpers } from '@components/helpers'
import { OrbitControls } from '@react-three/drei'
import { MathUtils, NoToneMapping, PCFShadowMap } from 'three'
import { Environment } from './Environment'
import { PostProcessing } from './PostProcessing'
import { World } from './World'

export function Experience() {
  return (
    <Canvas
      shadows={{ type: PCFShadowMap }}
      gl={{ toneMapping: NoToneMapping }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 100,
        position: [2, 4, 8],
      }}
    >
      <Environment />

      <OrbitControls
        makeDefault
        autoRotate
        enableDamping
        minDistance={4}
        maxDistance={15}
        maxPolarAngle={MathUtils.degToRad(90)}
        autoRotateSpeed={-0.5}
        target={[0, 1, 0]}
        screenSpacePanning={false}
      />

      <World />
      <Helpers />

      <PostProcessing />
    </Canvas>
  )
}
