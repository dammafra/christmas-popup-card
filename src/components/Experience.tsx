import { Canvas, Helpers } from '@components/helpers'
import { CameraControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { useControls } from 'leva'

import { Environment } from './Environment'
import { World } from './World'

export function Experience() {
  const physicsControls = useControls(
    'physics',
    { debug: false, paused: false },
    { order: 1, collapsed: true },
  )

  return (
    <Canvas
      shadows
      camera={{
        fov: 45,
        near: 0.1,
        far: 100,
        position: [2, 4, 6],
      }}
    >
      <Environment />
      <CameraControls makeDefault />

      <Physics {...physicsControls}>
        <World />
        <Helpers />
      </Physics>
    </Canvas>
  )
}
