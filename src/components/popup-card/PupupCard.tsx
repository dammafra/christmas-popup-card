import { useSpring } from '@react-spring/three'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useCallback, useEffect, useRef, useState, type JSX } from 'react'
import { AnimationClip, FrontSide, LoopOnce, Mesh, MeshStandardMaterial, Object3D } from 'three'

import { DirectionPhase, useDirection, useEditor } from '@stores'

import { Dedication } from './Dedication'
import { DedicationEditor } from './DedicationEditor'
import { Glow } from './Glow'
import { Message } from './Message'
import { MessageEditor } from './MessageEditor'

export function PopupCard(props: JSX.IntrinsicElements['group']) {
  const setPhase = useDirection(s => s.setPhase)
  const openTrigger = useDirection(s => s.open)
  const editMode = useEditor(s => s.enabled)

  const gl = useThree(s => s.gl)
  const { scene, animations } = useGLTF('/models/popup-card-compressed.glb')
  const { actions } = useAnimations<AnimationClip>(animations, scene)

  const animationTimeScale = 1.5
  const openAction = useRef(actions.open!)
  const bounceAction = useRef(actions.bounce!)
  const bounceTimeout = useRef<number | undefined>(undefined)

  const coverRef = useRef<Object3D>(null!)
  const emissiveMaterialsRef = useRef<MeshStandardMaterial[]>([])
  const [glow, setGlow] = useState(false)

  const scheduleBounce = useCallback((startOffset = 0) => {
    const clipDuration = openAction.current.getClip().duration
    const fadeTime = 0.25

    const fadeStartTime = clipDuration - fadeTime
    const timeRemaining = fadeStartTime - startOffset
    const delay = Math.max(0, (timeRemaining / animationTimeScale) * 1000)

    bounceTimeout.current = setTimeout(() => {
      bounceAction.current.reset()
      bounceAction.current.play()
      openAction.current.crossFadeTo(bounceAction.current, fadeTime, false)

      setGlow(true)
    }, delay)
  }, [])

  const open = useCallback(() => {
    const duration = openAction.current.getClip().duration
    const lastTime = Math.max(0, Math.min(openAction.current.time, duration))

    clearTimeout(bounceTimeout.current)
    openAction.current.reset()
    bounceAction.current.stop()

    openAction.current.timeScale = animationTimeScale
    openAction.current.time = lastTime
    openAction.current.play()

    scheduleBounce(lastTime)
  }, [glow, scheduleBounce])

  const close = useCallback(() => {
    const duration = openAction.current.getClip().duration
    const lastTime = Math.max(0, Math.min(openAction.current.time, duration))

    clearTimeout(bounceTimeout.current)
    openAction.current.reset()
    bounceAction.current.stop()

    openAction.current.timeScale = -animationTimeScale
    openAction.current.time = lastTime
    openAction.current.play()

    setGlow(false)
  }, [glow])

  useEffect(() => {
    setPhase(DirectionPhase.DEDICATION)
  }, [setPhase])

  useEffect(() => {
    if (openTrigger) open()
    else close()
  }, [openTrigger, open])

  useEffect(() => {
    scene.traverse(obj => {
      if (obj instanceof Mesh) {
        obj.castShadow = true
        obj.receiveShadow = true
        obj.material.side = FrontSide

        const maxAnisotropy = gl.capabilities.getMaxAnisotropy()
        obj.material.map.anisotropy = maxAnisotropy
        obj.material.map.needsUpdate = true

        if (obj.name === 'coverFront') obj.add(coverRef.current)

        if (obj.name.includes('tree')) {
          const material = obj.material as MeshStandardMaterial
          material.toneMapped = false
          material.emissive.set('gold')
          emissiveMaterialsRef.current.push(material)
        }
      }
    })

    openAction.current.setLoop(LoopOnce, 1)
    openAction.current.clampWhenFinished = true

    bounceAction.current.setLoop(LoopOnce, 1)
    bounceAction.current.clampWhenFinished = true

    return () => clearTimeout(bounceTimeout.current)
  }, [scene])

  const { emissiveIntensity } = useSpring({
    from: { emissiveIntensity: 0 },
    to: { emissiveIntensity: glow ? 5 : 0 },
    config: { duration: glow ? 2000 : 500 }, // speed of blink
    loop: { reverse: true },
  })

  useFrame(() => {
    for (const material of emissiveMaterialsRef.current) {
      material.emissiveIntensity = emissiveIntensity.get()
    }
  })

  return (
    <>
      <primitive object={scene} {...props} dispose={null} />

      <group ref={coverRef}>
        {editMode ? <DedicationEditor /> : <Dedication />}
        {editMode ? <MessageEditor /> : <Message />}
      </group>

      <Glow show={glow} />
    </>
  )
}

useGLTF.preload('/models/popup-card-compressed.glb')
