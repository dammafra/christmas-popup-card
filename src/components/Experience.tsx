import { Canvas, Helpers } from '@components/helpers'
import { OrbitControls } from '@react-three/drei'
import { Bloom, DepthOfField, EffectComposer, Vignette } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import { AgXToneMapping, MathUtils, PCFShadowMap } from 'three'
import { Environment } from './Environment'
import { World } from './World'

export function Experience() {
  return (
    <Canvas
      shadows={{ type: PCFShadowMap }}
      gl={{ toneMapping: AgXToneMapping }}
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
        minDistance={6}
        maxDistance={15}
        maxPolarAngle={MathUtils.degToRad(90)}
        autoRotateSpeed={-0.5}
        target={[0, 1, 0]}
        screenSpacePanning={false}
      />

      <World />
      <Helpers />

      <EffectComposer resolutionScale={0.75}>
        <DepthOfField focusDistance={0.32} focalLength={0.018} bokehScale={1.2} />
        <Bloom
          luminanceThreshold={1}
          luminanceSmoothing={0.025}
          kernelSize={KernelSize.VERY_SMALL}
        />
        <Vignette offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  )
}
