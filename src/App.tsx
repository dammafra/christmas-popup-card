import { StrictMode } from 'react'

import { Experience } from '@components'
import { GUI } from '@components/helpers'

export default function App() {
  return (
    <>
      <GUI />
      {/* <DoubleTapPreventer /> */}

      <StrictMode>
        <Experience />
      </StrictMode>
    </>
  )
}
