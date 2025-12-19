import { useAnimations, useGLTF } from '@react-three/drei'
import { useEffect, type JSX } from 'react'
import { AnimationAction, AnimationClip, LoopOnce, Mesh, MeshStandardMaterial } from 'three'

type ActionName = 'open'
type GLTFActions = Record<ActionName, AnimationAction>

export function PopupCard(props: JSX.IntrinsicElements['group']) {
  const { scene, animations } = useGLTF('/models/popup-card.glb')
  const animationClips = useAnimations<AnimationClip>(animations, scene)
  const actions = animationClips.actions as GLTFActions

  useEffect(() => {
    scene.traverse(obj => {
      if (obj instanceof Mesh) {
        obj.material = new MeshStandardMaterial({
          color: obj.name.includes('tree')
            ? obj.name.includes('Big')
              ? 'green'
              : 'limegreen'
            : 'red',
        })
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })

    const action = actions.open
    action.reset()
    action.setLoop(LoopOnce, 1)
    action.clampWhenFinished = true
    action.timeScale = 2
    action.play()
  }, [scene])

  return <primitive object={scene} {...props} dispose={null} />
}

useGLTF.preload('/models/popup-card.glb')
