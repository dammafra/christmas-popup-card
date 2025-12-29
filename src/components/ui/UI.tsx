import { a, config, useTransition } from '@react-spring/web'

import { useIsTouch } from '@hooks'
import { Phase, useDirection } from '@stores'
import { useState } from 'react'
import { Button } from './Button'

export function UI() {
  const isTouch = useIsTouch()

  const phase = useDirection(s => s.phase)
  const setPhase = useDirection(s => s.setPhase)

  const open = useDirection(s => s.open)
  const setOpen = useDirection(s => s.setOpen)
  const [disabledToggle, setDisabledToggle] = useState(false)

  const transitionConfig = {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.molasses,
  }

  const startActionTransition = useTransition(phase === Phase.READY, transitionConfig)
  const mainMenuTransition = useTransition(phase === Phase.END, {
    ...transitionConfig,
    delay: 3000,
  })

  return (
    <div className="fixed inset-0 pointer-events-none font-satisfy text-white text-xl">
      {startActionTransition(
        (spring, show) =>
          show && (
            <Button
              className="absolute! bottom-30 left-1/2 -translate-x-1/2 px-6 py-4 text-5xl"
              style={spring}
              onClick={() => setPhase(Phase.OPENING)}
            >
              Open
            </Button>
          ),
      )}

      {mainMenuTransition(
        (spring, show) =>
          show && (
            <a.div className="absolute top-4 left-4 flex flex-col gap-2" style={spring}>
              <Button disabled>Share your greetings</Button>
              <Button
                onClick={() => {
                  setOpen(!open)
                  setDisabledToggle(true)
                  setTimeout(() => setDisabledToggle(false), 1700)
                }}
                disabled={disabledToggle}
              >
                {open ? 'Close' : 'Open'} the greeting card
              </Button>
              <p>{isTouch ? 'Rotate with one finger' : 'Left click and drag to rotate'}</p>
              <p>{isTouch ? 'Move with two fingers' : 'Right click and drag to move'}</p>
              <p>{isTouch ? 'Pinch to zoom' : 'Scroll to zoom'}</p>
            </a.div>
          ),
      )}
    </div>
  )
}
