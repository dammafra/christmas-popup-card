import { MathUtils } from 'three'

import { HandwrittenText } from '@components/helpers'
import { Phase, useDirection } from '@stores'
import { safeJsonParse } from '@utils'

export function Message() {
  const phase = useDirection(s => s.phase)
  const setPhase = useDirection(s => s.setPhase)

  const message = safeJsonParse(atob(location.search.substring(1)), {
    message: `
      May this holiday season be filled with laughter, love and cherished moments with loved ones.

      Happy Christmas and a wonderful new year!


      From dammafra.
    `,
  }).message

  return (
    phase >= Phase.MESSAGE && (
      <HandwrittenText
        position={[3.4, -0.02, -2.25]}
        lineWidth={0.015}
        scale={0.2}
        maxWidth={10}
        speed={4}
        rotation={[MathUtils.degToRad(90), 0, MathUtils.degToRad(180)]}
        onResolve={() => setTimeout(() => setPhase(Phase.END), 1000)}
      >
        {message}
      </HandwrittenText>
    )
  )
}
