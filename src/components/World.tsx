import { RigidBody } from '@react-three/rapier'

export function World() {
  return (
    <>
      <RigidBody position={[0, 1, 0]}>
        <mesh castShadow>
          <boxGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed">
        <mesh receiveShadow scale={[5, 0.1, 5]}>
          <boxGeometry />
          <meshStandardMaterial color="limegreen" />
        </mesh>
      </RigidBody>
    </>
  )
}
