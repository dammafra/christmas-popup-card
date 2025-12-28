import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useCallback, useEffect, useRef, useState, type JSX } from 'react'
import { AnimationClip, LoopOnce, Mesh, MeshStandardMaterial, Object3D } from 'three'

import { Phase, useDirection } from '@stores'

import { Dedication } from './Dedication'
import { Glow } from './Glow'
import { Message } from './Message'

export function PopupCard(props: JSX.IntrinsicElements['group']) {
  const phase = useDirection(s => s.phase)
  const setPhase = useDirection(s => s.setPhase)
  const [isOpen, setIsOpen] = useState(false)

  const { scene, animations } = useGLTF('/models/popup-card.glb')
  const { actions } = useAnimations<AnimationClip>(animations, scene)

  const animationTimeScale = 1.5
  const openAction = useRef(actions.open!)
  const bounceAction = useRef(actions.bounce!)
  const bounceTimeout = useRef<number | undefined>(undefined)

  const coverRef = useRef<Object3D>(null!)

  const scheduleBounce = useCallback(() => {
    const clipDuration = openAction.current.getClip().duration
    const fadeTime = 0.25
    const delay = ((clipDuration - fadeTime) / animationTimeScale) * 1000

    bounceTimeout.current = setTimeout(() => {
      bounceAction.current.reset()
      bounceAction.current.play()
      openAction.current.crossFadeTo(bounceAction.current, fadeTime, false)
    }, delay)
  }, [])

  const open = useCallback(() => {
    if (isOpen || openAction.current.isRunning()) return

    clearTimeout(bounceTimeout.current)
    openAction.current.reset()
    bounceAction.current.stop()

    openAction.current.timeScale = animationTimeScale
    openAction.current.time = 0
    openAction.current.play()

    scheduleBounce()
    setIsOpen(true)
  }, [isOpen, scheduleBounce])

  const close = useCallback(() => {
    if (!isOpen || openAction.current.isRunning()) return

    clearTimeout(bounceTimeout.current)
    openAction.current.reset()
    bounceAction.current.stop()

    openAction.current.timeScale = -animationTimeScale
    openAction.current.time = openAction.current.getClip().duration
    openAction.current.play()

    setIsOpen(false)
  }, [isOpen])

  useEffect(() => {
    setPhase(Phase.READY)
  }, [setPhase])

  useEffect(() => {
    if (phase === Phase.OPEN) open()
  }, [phase, open])

  useEffect(() => {
    scene.traverse(obj => {
      if (obj instanceof Mesh) {
        obj.castShadow = true
        obj.receiveShadow = true

        if (obj.name === 'coverFront') obj.add(coverRef.current)
      }
    })

    openAction.current.setLoop(LoopOnce, 1)
    openAction.current.clampWhenFinished = true

    bounceAction.current.setLoop(LoopOnce, 1)
    bounceAction.current.clampWhenFinished = true

    return () => clearTimeout(bounceTimeout.current)
  }, [scene])

  useFrame(({ clock }) => {
    scene.traverse(obj => {
      if (obj instanceof Mesh && obj.name.includes('tree')) {
        const material = obj.material as MeshStandardMaterial
        material.toneMapped = false
        material.emissive.set('gold')
        material.emissiveIntensity = 2.5 + 2.5 * Math.sin(clock.elapsedTime * 2)
      }
    })
  })

  return (
    <>
      <primitive
        object={scene}
        {...props}
        dispose={null}
        onClick={() => {
          if (phase < Phase.END) return
          isOpen ? close() : open()
        }}
      />

      <group ref={coverRef}>
        <Dedication />
        <Message />
      </group>

      <Glow show={isOpen} />
    </>
  )
}

useGLTF.preload('/models/popup-card.glb')
