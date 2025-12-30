import { useTransition } from '@react-spring/web'
import { Html } from '@react-three/drei'
import { MathUtils } from 'three'

import { HandwrittenText } from '@components/helpers'
import { TextArea } from '@components/ui'
import { EditorPhase, useEditor } from '@stores'
import { useState } from 'react'

export function DedicationEditor() {
  const focus = useEditor(s => s.phase === EditorPhase.DEDICATION)
  const value = useEditor(s => s.dedication)
  const setValue = useEditor(s => s.setDedication)

  const [preview, setPreview] = useState(true)

  const transition = useTransition(focus, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    delay: focus ? 1500 : 0,
    onStart: () => setPreview(!focus),
  })

  return (
    <>
      {transition(
        (spring, focus) =>
          focus && (
            <Html
              transform
              scale={0.125}
              position={[1.83, 0.02, 0]}
              rotation-x={MathUtils.degToRad(-90)}
              className="scale-400"
            >
              <TextArea
                placeholder="Enter your dedication"
                maxLength={40}
                rows={4}
                onChange={e => setValue(e.target.value)}
                onFocus={e => (e.target.value = value)}
                style={spring}
                className="w-30 text-center px-5"
                autoFocus
              />
            </Html>
          ),
      )}
      <HandwrittenText
        position={[1.83, 0.02, 0]}
        rotation-x={MathUtils.degToRad(-90)}
        lineWidth={0.01}
        scale={0.2}
        maxWidth={6}
        textAlign="center"
        center
        animate={false}
        visible={preview}
      >
        {value}
      </HandwrittenText>
    </>
  )
}
