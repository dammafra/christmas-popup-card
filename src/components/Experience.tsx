import { Suspense } from 'react'
import { NoToneMapping, PCFShadowMap } from 'three'

import { Canvas, Helpers } from '@components/helpers'
import { PopupCard } from '@components/popup-card'

import { CameraRig } from './CameraRig'
import { Environment } from './Environment'
import { Loading } from './Loading'
import { PostProcessing } from './PostProcessing'

export function Experience() {
  return (
    <Canvas
      shadows={{ type: PCFShadowMap }}
      gl={{ toneMapping: NoToneMapping }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 100,
        position: [0, 2, 0],
      }}
    >
      <CameraRig />
      <Environment />

      <Loading />
      <Suspense>
        <PopupCard />
      </Suspense>

      <Helpers />
      <PostProcessing />
    </Canvas>
  )
}
