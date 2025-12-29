import { useTransition } from '@react-spring/web'
import { Html } from '@react-three/drei'
import { MathUtils } from 'three'

import { HandwrittenText } from '@components/helpers'
import { TextArea } from '@components/ui'
import { useEditor } from '@stores'
import { useState } from 'react'

export function MessageEditor() {
  const focus = useEditor(s => s.focus === 'message')
  const value = useEditor(s => s.message)
  const setValue = useEditor(s => s.setMessage)

  const [preview, setPreview] = useState(true)

  const transition = useTransition(focus, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    delay: focus ? 2500 : 0,
    onStart: () => setPreview(!focus),
  })

  return (
    <>
      {transition(
        (spring, focus) =>
          focus && (
            <Html
              scale={0.125}
              transform
              position={[2.45, -0.02, -0.1]}
              rotation={[MathUtils.degToRad(90), 0, MathUtils.degToRad(180)]}
              className="scale-400"
            >
              <TextArea
                placeholder="Insert your message here"
                maxLength={400}
                rows={21}
                onChange={e => setValue(e.target.value)}
                onFocus={e => (e.target.value = value)}
                style={spring}
                className="w-40 px-1"
                autoFocus
              />
            </Html>
          ),
      )}

      {preview && (
        <HandwrittenText
          position={[3.4, -0.02, -2.25]}
          rotation={[MathUtils.degToRad(90), 0, MathUtils.degToRad(180)]}
          lineWidth={0.015}
          scale={0.2}
          maxWidth={10}
          animate={false}
        >
          {value}
        </HandwrittenText>
      )}
    </>
  )
}
