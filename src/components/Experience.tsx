import { Canvas, Helpers } from '@components/helpers'
import { CameraControls } from '@react-three/drei'
import { Environment } from './Environment'
import { World } from './World'

export function Experience() {
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

      <World />
      <Helpers />
    </Canvas>
  )
}
