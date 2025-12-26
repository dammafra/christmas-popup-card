import { useShadowHelper } from '@hooks'
import { SpotLight } from '@react-three/drei'
import { useControls } from 'leva'
import { useEffect, useRef } from 'react'
import { SpotLight as ThreeSpotLight, Vector3 } from 'three'

export function Environment() {
  const { helpers, ambientLightIntensity, lightPosition, color } = useControls(
    'environment',
    {
      helpers: false,
      ambientLightIntensity: {
        value: 0.5,
        min: 0,
        max: 20,
        step: 0.01,
        label: 'ambient intensity',
      },
      lightPosition: {
        value: [-8, 10, -6],
        min: 0,
        max: 20,
        step: 0.01,
        label: 'light position',
      },
      color: '#FFB36A',
    },
    { collapsed: true },
  )

  const lightRef = useRef<ThreeSpotLight>(null!)
  const helperRef = useShadowHelper(lightRef)

  useEffect(() => {
    if (!helperRef.current) return
    helperRef.current.visible = helpers
  }, [helpers, helperRef])

  return (
    <>
      <SpotLight
        color={color}
        castShadow={false}
        position={lightPosition}
        distance={20}
        attenuation={13.5}
        radiusTop={2}
        radiusBottom={5}
      />

      <directionalLight
        ref={lightRef}
        color={color}
        castShadow
        intensity={5}
        position={new Vector3().fromArray(lightPosition).multiplyScalar(0.5)}
        shadow-mapSize={[1024, 1024]}
        shadow-radius={8}
        shadow-bias={0.0001}
        shadow-normalBias={0.1}
      />

      <ambientLight intensity={ambientLightIntensity} />
      <fogExp2 attach="fog" args={['#0f172b', 0.05]} />
    </>
  )
}
