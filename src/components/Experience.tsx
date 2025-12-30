import { useDetectGPU } from '@react-three/drei'
import { Suspense } from 'react'
import { NoToneMapping, PCFShadowMap, ReinhardToneMapping } from 'three'

import { Canvas, Helpers } from '@components/helpers'
import { PopupCard } from '@components/popup-card'
import { UI } from '@components/ui'

import { CameraRig } from './CameraRig'
import { Environment } from './Environment'
import { Loading } from './Loading'
import { PostProcessing } from './PostProcessing'

export function Experience() {
  const { tier } = useDetectGPU()

  return (
    <>
      <Canvas
        shadows={{ type: PCFShadowMap }}
        gl={{ toneMapping: tier >= 2 ? NoToneMapping : ReinhardToneMapping }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 100,
          position: [0, 1, 0],
        }}
      >
        <CameraRig />
        <Environment />

        <Loading />
        <Suspense>
          <PopupCard />
        </Suspense>

        <Helpers gizmoRenderPriority={tier >= 2 ? 3 : 1} />
        {tier >= 2 && <PostProcessing />}
      </Canvas>
      <UI />
    </>
  )
}
