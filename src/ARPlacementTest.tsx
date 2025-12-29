import { Canvas, useFrame } from '@react-three/fiber'
import { createXRStore, noEvents, PointerEvents, useXRHitTest, XR } from '@react-three/xr'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import { Matrix4, Vector3 } from 'three'

const store = createXRStore()

const matrixHelper = new Matrix4()
const hitTestPositionHelper = new Vector3()

function ObjectPlacement() {
  const [placedObjects, setPlacedObjects] = useState<THREE.Vector3[]>([])
  const previewRef = useRef<THREE.Mesh>(null)

  useXRHitTest(
    (results, getWorldMatrix) => {
      if (results.length === 0) return

      getWorldMatrix(matrixHelper, results[0])
      hitTestPositionHelper.setFromMatrixPosition(matrixHelper)
    },
    'viewer', // Cast rays from the viewer reference space. This will typically be either the camera or where the user is looking
    'plane', // Only hit test against detected planes
  )

  useFrame(() => {
    if (hitTestPositionHelper && previewRef.current) {
      previewRef.current.position.copy(hitTestPositionHelper)
    }
  })

  const placeObject = async () => {
    if (hitTestPositionHelper) {
      setPlacedObjects(prev => [...prev, hitTestPositionHelper.clone()])
    }
  }

  return (
    <>
      {/* Preview object at hit test position */}
      <mesh ref={previewRef} position={hitTestPositionHelper} onClick={placeObject} castShadow>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="red" />
      </mesh>

      {/* Placed objects */}
      {placedObjects.map((position, index) => (
        <mesh key={index} position={position} castShadow>
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial color="green" />
        </mesh>
      ))}
    </>
  )
}

export default function App() {
  return (
    <>
      <button
        onClick={() => store.enterAR()}
        style={{ position: 'absolute', zIndex: 10, padding: '12px' }}
      >
        Start AR
      </button>

      <Canvas events={noEvents}>
        <PointerEvents />

        <ambientLight intensity={2} />
        <directionalLight position={[4, 4, 2]} intensity={4} castShadow />

        <XR store={store}>
          <ObjectPlacement />
        </XR>
      </Canvas>
    </>
  )
}
