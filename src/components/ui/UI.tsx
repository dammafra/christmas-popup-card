import { a, config, useTransition } from '@react-spring/web'

import { useIsTouch } from '@hooks'
import { Phase, useDirection, useEditor } from '@stores'
import { Button } from './Button'

export function UI() {
  const isTouch = useIsTouch()

  const phase = useDirection(s => s.phase)
  const setPhase = useDirection(s => s.setPhase)

  const open = useDirection(s => s.open)
  const setOpen = useDirection(s => s.setOpen)

  const editMode = useEditor(s => s.enabled)
  const setEditMode = useEditor(s => s.setEnabled)
  const editFocus = useEditor(s => s.focus)
  const setFocus = useEditor(s => s.setFocus)

  const dedication = useEditor(s => s.dedication)
  const message = useEditor(s => s.message)

  const transitionConfig = {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.molasses,
  }

  const startActionTransition = useTransition(phase === Phase.READY, transitionConfig)
  const mainMenuTransition = useTransition(phase === Phase.END, {
    ...transitionConfig,
    delay: 3500,
  })

  const share = async () => {
    const query = btoa(JSON.stringify({ dedication, message }))

    const url = `${location.protocol}//${location.host}?${query}`
    const toShare = { text: url }

    navigator.clipboard.writeText(url)

    if (navigator.canShare(toShare)) {
      await navigator.share(toShare)
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none font-satisfy text-white text-xl z-99999999">
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
            <a.div className="absolute inset-4" style={spring}>
              <div className="flex flex-col justify-between absolute top-0 h-full">
                <div className="w-fit flex flex-col gap-2">
                  {editMode ? (
                    <>
                      <Button onClick={() => setEditMode(false)}>Back</Button>
                      <Button
                        onClick={() => setFocus('dedication')}
                        disabled={editFocus === 'dedication'}
                      >
                        Edit Dedication
                      </Button>
                      <Button
                        onClick={() => setFocus('message')}
                        disabled={editFocus === 'message'}
                      >
                        Edit Message
                      </Button>
                      <Button
                        onClick={() => {
                          setFocus('share')
                          share()
                        }}
                        disabled={!dedication || !message}
                      >
                        Share
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => setEditMode(true)}>Share your greetings</Button>
                      <Button onClick={() => setOpen(!open)}>
                        {open ? 'Close' : 'Open'} the greeting card
                      </Button>
                      <p>{isTouch ? 'Rotate with one finger' : 'Left click and drag to rotate'}</p>
                      <p>{isTouch ? 'Move with two fingers' : 'Right click and drag to move'}</p>
                      <p>{isTouch ? 'Pinch to zoom' : 'Scroll to zoom'}</p>
                    </>
                  )}
                </div>

                <p>
                  Made with ♥︎ by{' '}
                  <a
                    className="underline hover:bg-white/20 pointer-events-auto cursor-pointer"
                    target="_blank"
                    href="https://linktr.ee/dammafra"
                  >
                    dammafra
                  </a>
                </p>
              </div>
            </a.div>
          ),
      )}
    </div>
  )
}
