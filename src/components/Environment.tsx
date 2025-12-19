import { useShadowHelper } from '@hooks'
import { SoftShadows, SpotLight } from '@react-three/drei'
import { useControls } from 'leva'
import { useEffect, useRef } from 'react'
import { SpotLight as ThreeSpotLight, Vector3 } from 'three'

export function Environment() {
  const { helpers, ambientLightIntensity, spotLightPosition, color } = useControls(
    'environment',
    {
      helpers: false,
      ambientLightIntensity: {
        value: 0.25,
        min: 0,
        max: 20,
        step: 0.01,
        label: 'ambient intensity',
      },
      spotLightPosition: {
        value: [8, 10, -6],
        min: 0,
        max: 20,
        step: 0.01,
        label: 'spot position',
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
  }, [helpers])

  return (
    <>
      <SpotLight
        color={color}
        castShadow={false}
        position={spotLightPosition}
        distance={15}
        attenuation={15}
        radiusTop={2}
        radiusBottom={5}
      />

      <spotLight
        ref={lightRef}
        color={color}
        castShadow
        position={new Vector3().fromArray(spotLightPosition).multiplyScalar(0.5)}
        distance={20}
        power={150}
        penumbra={0.5}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
        shadow-normalBias={0.065}
      />

      <ambientLight intensity={ambientLightIntensity} />
      <SoftShadows samples={50} focus={10} />
      <fogExp2 attach="fog" args={['#0f172b', 0.05]} />
    </>
  )
}

// import { Helper, SoftShadows } from '@react-three/drei'
// import { useControls } from 'leva'
// import { CameraHelper } from 'three'

// export function Environment() {
//   const { helpers, ambientLightIntensity, directionalLightIntensity, directionalLightPosition } =
//     useControls(
//       'environment',
//       {
//         helpers: false,
//         ambientLightIntensity: {
//           value: 1.5,
//           min: 0,
//           max: 20,
//           step: 0.01,
//           label: 'ambient intensity',
//         },
//         directionalLightIntensity: {
//           value: 4.5,
//           min: 0,
//           max: 20,
//           step: 0.01,
//           label: 'directional intensity',
//         },
//         directionalLightPosition: {
//           value: [4, 4, 1],
//           min: 0,
//           max: 20,
//           step: 0.01,
//           label: 'directional position',
//         },
//       },
//       { collapsed: true },
//     )

//   return (
//     <>
//       <directionalLight
//         castShadow
//         position={directionalLightPosition}
//         intensity={directionalLightIntensity}
//         shadow-mapSize={[512, 512]}
//       >
//         <orthographicCamera
//           attach="shadow-camera"
//           near={1}
//           far={10}
//           top={5}
//           right={5}
//           bottom={-5}
//           left={-5}
//         >
//           {helpers && <Helper type={CameraHelper} />}
//         </orthographicCamera>
//       </directionalLight>

//       <ambientLight intensity={ambientLightIntensity} />

//       <SoftShadows samples={50} />
//     </>
//   )
// }
