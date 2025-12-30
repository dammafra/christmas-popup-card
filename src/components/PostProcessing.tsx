import { config, useSpring } from '@react-spring/three'
import { Bloom, DepthOfField, EffectComposer, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode, VignetteEffect } from 'postprocessing'
import { useMemo } from 'react'

import { DirectionPhase, useDirection } from '@stores'

export function PostProcessing() {
  const phase = useDirection(s => s.phase)

  const darknessFrom = 1.8
  const darknessTo = 1.1

  const vignetteEffect = useMemo(
    () =>
      new VignetteEffect({
        offset: 0.1,
        darkness: darknessFrom,
      }),
    [],
  )

  useSpring({
    from: { darkness: darknessFrom },
    to: { darkness: phase !== DirectionPhase.LOADING ? darknessTo : darknessFrom },
    config: config.molasses,
    onChange: v => {
      // eslint-disable-next-line
      vignetteEffect.darkness = v.value.darkness
    },
  })

  return (
    <EffectComposer resolutionScale={0.5} multisampling={0}>
      <Bloom intensity={1} luminanceThreshold={2} luminanceSmoothing={0.2} />
      <DepthOfField focusDistance={0.32} focalLength={0.018} bokehScale={1} />
      <primitive object={vignetteEffect} dispose={null} />
      <ToneMapping mode={ToneMappingMode.UNCHARTED2} />
    </EffectComposer>
  )
}
