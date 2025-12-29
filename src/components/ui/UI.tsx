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

  const startActionTransition = useTransition(phase === Phase.DEDICATION, {
    ...transitionConfig,
    delay: phase === Phase.DEDICATION ? 1000 : 0,
  })
  const skipActionTransition = useTransition(
    phase >= Phase.OPENING && phase < Phase.END,
    transitionConfig,
  )
  const mainMenuTransition = useTransition(phase === Phase.END, {
    ...transitionConfig,
    delay: 3500,
  })
  const innerMenuTransition = useTransition(editMode, transitionConfig)

  const share = async () => {
    const query = btoa(
      JSON.stringify({
        dedication: encodeURIComponent(dedication),
        message: encodeURIComponent(message),
      }),
    )

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

      {skipActionTransition(
        (spring, show) =>
          show && (
            <Button
              className="absolute! bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 text-2xl"
              style={spring}
              onClick={() => setPhase(Phase.END)}
            >
              Skip
            </Button>
          ),
      )}

      {mainMenuTransition(
        (spring, show) =>
          show && (
            <a.div className="absolute inset-4 text-right" style={spring}>
              {innerMenuTransition(
                (spring, editing) =>
                  editing && (
                    <a.div
                      className="absolute bottom-0  left-1/2 -translate-x-1/2 flex gap-2 w-full justify-center text-2xl"
                      style={spring}
                    >
                      {editFocus === 'dedication' && (
                        <Button
                          className="px-6 py-2"
                          onClick={() => setFocus('message')}
                          disabled={!editMode || !dedication}
                        >
                          Next
                        </Button>
                      )}
                      {editFocus !== 'dedication' && (
                        <Button
                          className="px-6 py-2"
                          onClick={() => {
                            setFocus('share')
                            share()
                          }}
                          disabled={!editMode || !message}
                        >
                          {editFocus === 'share' ? 'URL Copied' : 'Share'}
                        </Button>
                      )}
                    </a.div>
                  ),
              )}

              {innerMenuTransition((spring, editing) =>
                editing ? (
                  <a.div className="absolute right-0 flex flex-col gap-2 w-fit" style={spring}>
                    <Button onClick={() => setEditMode(false)} disabled={!editMode}>
                      Back
                    </Button>
                  </a.div>
                ) : (
                  <a.div className="absolute right-0 flex flex-col gap-2 w-fit" style={spring}>
                    <Button onClick={() => setEditMode(true)} disabled={editMode}>
                      Share your greetings
                    </Button>
                    <Button onClick={() => setOpen(!open)} disabled={editMode}>
                      {open ? 'Close' : 'Open'} the greeting card
                    </Button>
                    <p>{isTouch ? 'Rotate with one finger' : 'Left click and drag to rotate'}</p>
                    <p>{isTouch ? 'Move with two fingers' : 'Right click and drag to move'}</p>
                    <p>{isTouch ? 'Pinch to zoom' : 'Scroll to zoom'}</p>
                  </a.div>
                ),
              )}

              {innerMenuTransition(
                (spring, editing) =>
                  !editing && (
                    <a.p className="absolute bottom-0" style={spring}>
                      Made with ♥︎ by{' '}
                      <a
                        className="underline hover:bg-white/20 pointer-events-auto cursor-pointer"
                        target="_blank"
                        href="https://linktr.ee/dammafra"
                      >
                        dammafra
                      </a>
                    </a.p>
                  ),
              )}
            </a.div>
          ),
      )}
    </div>
  )
}
