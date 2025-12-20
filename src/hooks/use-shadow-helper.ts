// Source - https://stackoverflow.com/a
// Posted by Roland Branten, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-19, License - CC BY-SA 4.0
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, type RefObject } from 'react'
import { CameraHelper, Light } from 'three'

export function useShadowHelper(ref: RefObject<Light | null>) {
  const scene = useThree(state => state.scene)
  const helperRef = useRef<CameraHelper>(null)

  useEffect(() => {
    if (!ref.current?.shadow?.camera) return

    const helper = new CameraHelper(ref.current.shadow.camera)
    scene.add(helper)

    helperRef.current = helper

    return () => {
      scene.remove(helper)
    }
  }, [ref, scene])

  useFrame(() => {
    if (!helperRef.current) return
    helperRef.current.update()
  })

  return helperRef
}
