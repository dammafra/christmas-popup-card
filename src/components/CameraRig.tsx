import { CameraControls, type CameraControlsImpl } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { MathUtils } from 'three'

import { useDebug } from '@hooks'
import { Phase, useDirection } from '@stores'

export function CameraRig() {
  const debug = useDebug()
  const { controls, viewport } = useThree()

  const phase = useDirection(s => s.phase)
  const setPhase = useDirection(s => s.setPhase)

  useEffect(() => {
    const cameraControls = controls as CameraControlsImpl
    if (!cameraControls) return

    switch (phase) {
      case Phase.LOADING:
      case Phase.READY:
        cameraControls.moveTo(0, viewport.aspect < 1 ? 1.5 : 0, 0, true)
        break
      case Phase.OPENING:
        cameraControls.smoothTime = 2
        cameraControls.dollyTo(8, true)
        cameraControls.moveTo(0, 1, 0, true)
        cameraControls.rotatePolarTo(MathUtils.degToRad(60), true)
        cameraControls.rotateAzimuthTo(MathUtils.degToRad(-360), true).then(() => {
          cameraControls.smoothTime = 1
          cameraControls.normalizeRotations()
          cameraControls.rotatePolarTo(0, true)
          cameraControls.rotateAzimuthTo(0, true)
          cameraControls.moveTo(-2.1, 2.5, 0, true)
          cameraControls
            .dollyTo(viewport.aspect < 1 ? 5.5 : 4, true)
            .then(() => setPhase(Phase.MESSAGE))
        })

        setTimeout(() => setPhase(Phase.OPEN), 2500)
        break

      case Phase.END:
        cameraControls.smoothTime = 2
        cameraControls.dollyTo(8, true)
        cameraControls.moveTo(0, 1, 0, true)
        cameraControls.rotatePolarTo(MathUtils.degToRad(60), true)
        cameraControls.rotateAzimuthTo(MathUtils.degToRad(20), true).then(() => {
          cameraControls.smoothTime = 0.25
          cameraControls.minDistance = 2
          cameraControls.maxDistance = 15
          cameraControls.truckSpeed = 0
          cameraControls.enabled = true
        })

        break
    }
  }, [controls, phase, viewport, setPhase])

  return <CameraControls makeDefault enabled={debug} maxPolarAngle={MathUtils.degToRad(90)} />
}
