import { useShadowHelper } from '@hooks'
import { useControls } from 'leva'
import { useEffect, useRef } from 'react'
import { SpotLight as ThreeSpotLight, Vector3 } from 'three'

export function Environment() {
  const { helpers, ambientLightIntensity, lightIntensity, lightPosition, color } = useControls(
    'environment',
    {
      helpers: false,
      ambientLightIntensity: {
        value: 1,
        min: 0,
        max: 20,
        step: 0.01,
        label: 'ambient intensity',
      },
      lightIntensity: {
        value: 10,
        min: 0,
        max: 20,
        step: 0.01,
        label: 'light intensity',
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
      {/* <SpotLight
        color={color}
        castShadow={false}
        position={lightPosition}
        distance={30}
        attenuation={20}
        radiusTop={2}
        radiusBottom={5}
        volumetric
        opacity={0.7}
      /> */}

      <directionalLight
        ref={lightRef}
        color={color}
        castShadow
        intensity={lightIntensity}
        position={new Vector3().fromArray(lightPosition).multiplyScalar(0.5)}
        shadow-mapSize={[1024, 1024]}
        shadow-radius={8}
        shadow-bias={0.0001}
        shadow-normalBias={0.1}
      />

      <ambientLight intensity={ambientLightIntensity} />
      {/* <fogExp2 attach="fog" args={['black', 0.06]} /> */}
    </>
  )
}
