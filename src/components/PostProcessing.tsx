import {
  Bloom,
  DepthOfField,
  EffectComposer,
  ToneMapping,
  Vignette,
} from '@react-three/postprocessing'
import { KernelSize, ToneMappingMode } from 'postprocessing'

export function PostProcessing() {
  return (
    <EffectComposer resolutionScale={0.5} multisampling={0}>
      <Bloom
        intensity={0.8}
        luminanceThreshold={1.5}
        luminanceSmoothing={0.2}
        kernelSize={KernelSize.SMALL}
      />
      <DepthOfField focusDistance={0.32} focalLength={0.018} bokehScale={0.8} />
      <Vignette offset={0.1} darkness={1.1} />
      <ToneMapping mode={ToneMappingMode.UNCHARTED2} />
    </EffectComposer>
  )
}
