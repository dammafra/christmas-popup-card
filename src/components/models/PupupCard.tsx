import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useCallback, useEffect, useRef, useState, type JSX } from 'react'
import { AnimationClip, LoopOnce, Mesh, MeshStandardMaterial } from 'three'

export function PopupCard(props: JSX.IntrinsicElements['group']) {
  const { scene, animations } = useGLTF('/models/popup-card.glb')
  const { actions } = useAnimations<AnimationClip>(animations, scene)
  const openAction = useRef(actions.open!)
  const bounceAction = useRef(actions.bounce!)

  const [isOpen, setIsOpen] = useState(true)

  const toggle = useCallback(() => {
    if (openAction.current.isRunning()) return

    openAction.current.reset()
    bounceAction.current.stop()
    openAction.current.timeScale *= -1
    openAction.current.time = isOpen ? openAction.current.getClip().duration : 0
    openAction.current.play()

    setIsOpen(!isOpen)
  }, [isOpen])

  useEffect(() => {
    scene.traverse(obj => {
      if (!(obj instanceof Mesh)) return

      obj.castShadow = true
      obj.receiveShadow = true
    })

    openAction.current.setLoop(LoopOnce, 1)
    openAction.current.clampWhenFinished = true
    openAction.current.timeScale = 1.5
    openAction.current.play()

    bounceAction.current.setLoop(LoopOnce, 1)
    bounceAction.current.clampWhenFinished = true
  }, [scene])

  useFrame(() => {
    const open = openAction.current
    const bounce = bounceAction.current
    const clipDuration = open.getClip().duration
    const fadeTime = 0.25

    if (!open.isRunning()) return
    if (open.timeScale < 0) return
    if (open.time >= clipDuration - fadeTime && !bounce.isRunning()) {
      bounce.reset()
      open.crossFadeTo(bounce, fadeTime, false)
      bounce.play()
    }
  })

  useFrame(({ clock }) => {
    scene.traverse(obj => {
      if (!(obj instanceof Mesh) || !obj.name.includes('tree')) return

      const material = obj.material as MeshStandardMaterial
      material.toneMapped = false
      material.emissive.set('gold')
      material.emissiveIntensity = 2.5 + 2.5 * Math.sin(clock.elapsedTime * 2)
    })
  })

  return <primitive object={scene} {...props} dispose={null} onDoubleClick={toggle} />
}

useGLTF.preload('/models/popup-card.glb')
