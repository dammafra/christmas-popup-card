import { Suspense } from 'react'
import { Snow } from './Snow'
import { PopupCard } from './models'

export function World() {
  return (
    <>
      <Suspense
        fallback={
          <mesh scale={[3.66, 0.08, 5.14]}>
            <boxGeometry />
            <meshStandardMaterial color="#AC301E" />
          </mesh>
        }
      >
        <PopupCard />
      </Suspense>
      <Snow />
    </>
  )
}
