import { a, config, useTransition } from '@react-spring/web'

import { useIsTouch } from '@hooks'
import { Phase, useDirection } from '@stores'
import { Button } from './Button'

export function UI() {
  const isTouch = useIsTouch()

  const phase = useDirection(s => s.phase)
  const setPhase = useDirection(s => s.setPhase)

  const open = useDirection(s => s.open)
  const toggleOpen = useDirection(s => s.toggleOpen)

  const transitionConfig = {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.molasses,
  }

  const startActionTransition = useTransition(phase === Phase.READY, transitionConfig)
  const mainMenuTransition = useTransition(phase === Phase.END, transitionConfig)

  return (
    <div className="fixed inset-0 pointer-events-none">
      {startActionTransition(
        (spring, show) =>
          show && (
            <Button
              className="absolute! text-white bottom-30 left-1/2 -translate-x-1/2 px-6 py-4 font-satisfy text-5xl"
              style={spring}
              onClick={() => setPhase(Phase.OPENING)}
            >
              Read
            </Button>
          ),
      )}

      {mainMenuTransition(
        (spring, show) =>
          show && (
            <a.div
              className="absolute top-4 left-4 text-white text-xl font-satisfy flex flex-col gap-2"
              style={spring}
            >
              <p>{isTouch ? 'Rotate with one finger' : 'Left click and drag to rotate'}</p>
              <p>{isTouch ? 'Move with two fingers' : 'Right click and drag to move'}</p>
              <p>{isTouch ? 'Pinch to zoom' : 'Scroll to zoom'}</p>
              <Button className="block px-2 py-1" onClick={toggleOpen}>
                {open ? 'Close' : 'Open'} the greeting card
              </Button>
              <Button className="block px-2 py-1" disabled>
                Share your greetings
              </Button>
            </a.div>
          ),
      )}
    </div>
  )
}
