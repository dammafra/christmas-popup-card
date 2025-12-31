import { CameraControls, type CameraControlsImpl } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Box3, MathUtils, Vector3 } from 'three'

import { useDebug } from '@hooks'
import { DirectionPhase, EditorPhase, useDirection, useEditor } from '@stores'

export function CameraRig() {
  const debug = useDebug()
  const controls = useThree(s => s.controls)
  const viewport = useThree(s => s.viewport)

  const phase = useDirection(s => s.phase)
  const setPhase = useDirection(s => s.setPhase)
  const setOpen = useDirection(s => s.setOpen)

  const editMode = useEditor(s => s.enabled)
  const editorPhase = useEditor(s => s.phase)

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
      cameraControls.rotatePolarTo(MathUtils.degToRad(1), true),
      cameraControls.rotateAzimuthTo(0, true),
      cameraControls.dollyTo(viewport.aspect < 1 ? 4.5 : 2, true),
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
      cameraControls.rotatePolarTo(MathUtils.degToRad(editMode ? 1 : 60), true),

      cameraControls.rotateAzimuthTo(MathUtils.degToRad(editMode ? 0 : -360), true).then(() => {
        if (animationId.current !== currentId) return

        if (!editMode) setPhase(DirectionPhase.MESSAGE)

        cameraControls.smoothTime = 1
        cameraControls.normalizeRotations()

        return Promise.all([
          cameraControls.rotatePolarTo(MathUtils.degToRad(1), true),
          cameraControls.rotateAzimuthTo(0, true),
          cameraControls.moveTo(-2.5, 2.5, 0, true),
          cameraControls.dollyTo(viewport.aspect < 1 ? 4 : 4, true),
        ])
      }),
    ])
  }

  function defaults(currentId: number) {
    setOpen(true)

    const cameraControls = controls as CameraControlsImpl

    disable()
    cameraControls.smoothTime = 1
    cameraControls.normalizeRotations()

    return Promise.all([
      cameraControls.dollyTo(viewport.aspect < 1 ? 10 : 8, true),
      cameraControls.moveTo(0, viewport.aspect < 1 ? 0.5 : 1, 0, true),
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
      case DirectionPhase.LOADING:
      case DirectionPhase.DEDICATION:
        dedicationFocus(currentId)
        break
      case DirectionPhase.OPENING:
        messageFocus(currentId)
        break
      case DirectionPhase.END:
        defaults(currentId)
        break
    }
  }, [phase, editMode, viewport, setPhase, controls])

  useEffect(() => {
    if (!controls || !editMode) return

    cancelPendingLogic()
    const currentId = animationId.current

    switch (editorPhase) {
      case EditorPhase.DEDICATION:
        dedicationFocus(currentId)
        break
      case EditorPhase.MESSAGE:
        messageFocus(currentId)
        break

      case EditorPhase.PREVIEW:
      case EditorPhase.SHARE:
        defaults(currentId)
        break
    }
  }, [editorPhase, editMode, viewport, controls])

  return <CameraControls makeDefault enabled={debug} maxPolarAngle={MathUtils.degToRad(90)} />
}
