import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useCallback, useEffect, useRef, useState, type JSX } from 'react'
import { AnimationClip, LoopOnce, Mesh, MeshStandardMaterial } from 'three'

export function PopupCard(props: JSX.IntrinsicElements['group']) {
  const { scene, animations } = useGLTF('/models/popup-card.glb')
  const { actions } = useAnimations<AnimationClip>(animations, scene)
  const openAction = useRef(actions.open!)

  const [isOpen, setIsOpen] = useState(true)

  const toggle = useCallback(() => {
    if (openAction.current.isRunning()) return

    openAction.current.reset()
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
    openAction.current.timeScale = 2
    openAction.current.play()
  }, [scene])

  useFrame(({ clock }) => {
    scene.traverse(obj => {
      if (!(obj instanceof Mesh) || !obj.name.includes('tree')) return

      const material = obj.material as MeshStandardMaterial
      material.emissive.set('gold')
      material.emissiveIntensity = 2.5 + 2.5 * Math.sin(clock.elapsedTime * 2)
    })
  })

  return <primitive object={scene} {...props} dispose={null} onClick={toggle} />
}

useGLTF.preload('/models/popup-card.glb')
