import { Canvas, Helpers } from '@components/helpers'
import { OrbitControls } from '@react-three/drei'
import { Bloom, DepthOfField, EffectComposer, ToneMapping } from '@react-three/postprocessing'
import { KernelSize, ToneMappingMode } from 'postprocessing'
import { MathUtils, NoToneMapping, PCFShadowMap } from 'three'
import { Environment } from './Environment'
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

      <EffectComposer resolutionScale={0.5} multisampling={0}>
        <Bloom
          intensity={0.5}
          luminanceThreshold={1.5}
          luminanceSmoothing={0.2}
          kernelSize={KernelSize.SMALL}
        />
        <DepthOfField focusDistance={0.32} focalLength={0.018} bokehScale={0.8} />
        <ToneMapping mode={ToneMappingMode.UNCHARTED2} />
      </EffectComposer>
    </Canvas>
  )
}
