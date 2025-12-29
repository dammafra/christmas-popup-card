import { CameraControls, type CameraControlsImpl } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Box3, MathUtils, Vector3 } from 'three'

import { useDebug } from '@hooks'
import { Phase, useDirection, useEditor } from '@stores'

export function CameraRig() {
  const debug = useDebug()
  const { controls, viewport } = useThree()

  const phase = useDirection(s => s.phase)
  const setPhase = useDirection(s => s.setPhase)
  const setOpen = useDirection(s => s.setOpen)

  const editMode = useEditor(s => s.enabled)
  const editFocus = useEditor(s => s.focus)

  const timeoutRef = useRef<number>(null)
  const animationId = useRef(0)

  function cancelPendingLogic() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    animationId.current++
  }

  function disable() {
    const cameraControls = controls as CameraControlsImpl

    cameraControls.smoothTime = editMode ? 1 : 2
    cameraControls.minDistance = Number.EPSILON
    cameraControls.maxDistance = Infinity
    cameraControls.setBoundary(undefined)
    cameraControls.enabled = debug
  }

  function enable() {
    const cameraControls = controls as CameraControlsImpl

    cameraControls.smoothTime = 0.25
    cameraControls.minDistance = 2
    cameraControls.maxDistance = 15
    cameraControls.setBoundary(new Box3(new Vector3(-3, 0, -3), new Vector3(3, 1, 0)))
    cameraControls.enabled = true
  }

  function dedicationFocus(_currentId: number) {
    setOpen(false)
    const cameraControls = controls as CameraControlsImpl

    disable()
    cameraControls.normalizeRotations()

    return Promise.all([
      cameraControls.moveTo(0, 0, 0, true),
      cameraControls.rotatePolarTo(0, true),
      cameraControls.rotateAzimuthTo(0, true),
      cameraControls.dollyTo(viewport.aspect < 1 ? 4 : 2, true),
    ])
  }

  function messageFocus(currentId: number) {
    timeoutRef.current = setTimeout(
      () => {
        if (animationId.current !== currentId) return
        setOpen(true)
      },
      editMode ? 0 : 2500,
    )

    const cameraControls = controls as CameraControlsImpl

    disable()
    cameraControls.normalizeRotations()

    return Promise.all([
      cameraControls.dollyTo(8, true),
      cameraControls.moveTo(0, 1, 0, true),
      cameraControls.rotatePolarTo(MathUtils.degToRad(editMode ? 0 : 60), true),

      cameraControls.rotateAzimuthTo(MathUtils.degToRad(editMode ? 0 : -360), true).then(() => {
        if (animationId.current !== currentId) return

        cameraControls.smoothTime = 1
        cameraControls.normalizeRotations()

        return Promise.all([
          cameraControls.rotatePolarTo(0, true),
          cameraControls.rotateAzimuthTo(0, true),
          cameraControls.moveTo(-2.1, 2.5, 0, true),
          cameraControls.dollyTo(viewport.aspect < 1 ? 5.5 : 4, true),
        ])
      }),
    ]).then(() => {
      if (editMode || animationId.current !== currentId) return
      setPhase(Phase.MESSAGE)
    })
  }

  function defaults(currentId: number) {
    setOpen(true)

    const cameraControls = controls as CameraControlsImpl

    disable()
    cameraControls.smoothTime = 1

    return Promise.all([
      cameraControls.dollyTo(8, true),
      cameraControls.moveTo(0, 1, 0, true),
      cameraControls.rotatePolarTo(MathUtils.degToRad(60), true),

      cameraControls.rotateAzimuthTo(MathUtils.degToRad(20), true).then(() => {
        if (animationId.current !== currentId) return
        enable()
      }),
    ])
  }

  useEffect(() => {
    if (!controls || editMode) return

    cancelPendingLogic()
    const currentId = animationId.current

    switch (phase) {
      case Phase.LOADING:
      case Phase.DEDICATION:
        dedicationFocus(currentId)
        break
      case Phase.OPENING:
        messageFocus(currentId)
        break
      case Phase.END:
        defaults(currentId)
        break
    }
  }, [phase, editMode, viewport, setPhase, controls])

  useEffect(() => {
    if (!controls || !editMode) return

    cancelPendingLogic()
    const currentId = animationId.current

    switch (editFocus) {
      case 'dedication':
        dedicationFocus(currentId)
        break
      case 'message':
        messageFocus(currentId)
        break

      case 'share':
        defaults(currentId)
        break
    }
  }, [editFocus, editMode, viewport, controls])

  return <CameraControls makeDefault enabled={debug} maxPolarAngle={MathUtils.degToRad(90)} />
}
