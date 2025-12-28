import { GizmoHelper, GizmoViewport } from '@react-three/drei'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'

import { useDebug } from '@hooks'

export function Helpers() {
  const debug = useDebug()

  const { grid, axes, gizmo } = useControls(
    'helpers',
    {
      grid: false,
      axes: false,
      gizmo: debug,
    },
    { order: 3, collapsed: true },
  )

  return (
    <>
      {axes && <axesHelper args={[20]} position-y={-0.001} />}
      {grid && <gridHelper args={[10, 10, 'red', 'gray']} position-y={-0.002} />}

      {gizmo && (
        <GizmoHelper renderPriority={999}>
          <GizmoViewport labelColor="white" />
        </GizmoHelper>
      )}

      {debug && <Perf showGraph={false} position="top-right" />}
    </>
  )
}
