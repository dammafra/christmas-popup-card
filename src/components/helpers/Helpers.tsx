import { useDebug } from '@hooks'
import { GizmoHelper, GizmoViewport } from '@react-three/drei'
import { useRapier } from '@react-three/rapier'
import { button, monitor, useControls } from 'leva'
import { Perf } from 'r3f-perf'

export function Helpers() {
  const debug = useDebug()
  const { step, world } = useRapier()

  const { grid, axes, gizmo } = useControls(
    'helpers',
    {
      grid: false,
      axes: false,
      gizmo: false,
    },
    { order: 3, collapsed: true },
  )

  useControls('physics', {
    step: button(() => step(1 / 60)),
    bodies: monitor(() => world.bodies.len()),
    colliders: monitor(() => world.colliders.len()),
    joints: monitor(() => world.impulseJoints.len()),
  })

  return (
    <>
      {grid && <gridHelper args={[10, 10, 'red', 'gray']} />}
      {axes && <axesHelper args={[20]} position-y={0.001} />}

      {gizmo && (
        <GizmoHelper>
          <GizmoViewport labelColor="white" />
        </GizmoHelper>
      )}

      {debug && <Perf showGraph={false} position="top-right" />}
    </>
  )
}
