import { MathUtils } from 'three'

import { HandwrittenText } from '@components/helpers'
import { DirectionPhase, useDirection } from '@stores'
import { randomOneOf, safeDecode } from '@utils'
import { useMemo } from 'react'

const MESSAGES = [
  'Wishing you a joyful Christmas and a New Year filled with peace and happiness.',
  'May this holiday season be filled with laughter, love and cherished moments with loved ones.',
  'Sending you heartfelt wishes for a Merry Christmas and a wonderful New Year.',
  'May this festive season bring you joy, love, and unforgettable memories.',
  'Warmest wishes for a Christmas full of cheer and a bright New Year ahead.',
  'Hoping your holidays are filled with happiness, relaxation, and good company.',
  'Wishing you all the magic of Christmas and the hope of a prosperous New Year.',
  'May the spirit of the season fill your heart with peace and happiness throughout the year.',
  'Sending love and best wishes for a festive Christmas and a successful New Year.',
  'May your holidays sparkle with joy and your New Year be full of exciting opportunities.',
]

export function Message() {
  const phase = useDirection(s => s.phase)
  const setPhase = useDirection(s => s.setPhase)

  const message = useMemo(
    () =>
      decodeURIComponent(
        safeDecode(location.search.substring(1), {
          message: randomOneOf(MESSAGES).concat(`

      From dammafra.
    `),
        }).message,
      ),
    [],
  )

  return (
    phase >= DirectionPhase.MESSAGE && (
      <HandwrittenText
        position={[3.4, -0.02, -2.25]}
        lineWidth={0.015}
        scale={0.2}
        maxWidth={10}
        speed={phase > DirectionPhase.MESSAGE ? 20 : 5}
        rotation={[MathUtils.degToRad(90), 0, MathUtils.degToRad(180)]}
        onResolve={() => setTimeout(() => setPhase(DirectionPhase.END), 1000)}
      >
        {message}
      </HandwrittenText>
    )
  )
}
