import { a, config, useTransition } from '@react-spring/web'
import clsx from 'clsx'

import { useDebug, useIsTouch } from '@hooks'
import { DirectionPhase, EditorPhase, useDirection, useEditor } from '@stores'
import { generateShortURL } from '@utils'

import { Button } from './Button'

export function UI() {
  const debug = useDebug()
  const isTouch = useIsTouch()

  const phase = useDirection(s => s.phase)
  const setPhase = useDirection(s => s.setPhase)

  const open = useDirection(s => s.open)
  const setOpen = useDirection(s => s.setOpen)

  const editMode = useEditor(s => s.enabled)
  const setEditMode = useEditor(s => s.setEnabled)
  const editorPhase = useEditor(s => s.phase)
  const setEditorPhase = useEditor(s => s.setPhase)

  const dedication = useEditor(s => s.dedication)
  const message = useEditor(s => s.message)

  const transitionConfig = {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.molasses,
  }

  const startActionTransition = useTransition(phase === DirectionPhase.DEDICATION, {
    ...transitionConfig,
    delay: phase === DirectionPhase.DEDICATION ? 1000 : 0,
  })
  const skipActionTransition = useTransition(
    phase >= DirectionPhase.OPENING && phase < DirectionPhase.END,
    transitionConfig,
  )
  const mainMenuTransition = useTransition(phase === DirectionPhase.END, transitionConfig)
  const innerMenuTransition = useTransition(editMode, transitionConfig)
  const editMenuTransition = useTransition(editorPhase >= EditorPhase.PREVIEW, transitionConfig)

  const share = async () => {
    const query = btoa(
      JSON.stringify({
        dedication: encodeURIComponent(dedication),
        message: encodeURIComponent(message),
      }),
    )

    const url = await generateShortURL(`${location.protocol}//${location.host}?${query}`, debug)
    const toShare = { text: url }

    navigator.clipboard.writeText(url)

    if (navigator.canShare(toShare)) {
      await navigator.share(toShare)
    }
  }

  const EDIT_WIZARD = {
    [EditorPhase.DEDICATION]: {
      label: 'Next',
      action: () => setEditorPhase(EditorPhase.MESSAGE),
      disabled: !editMode || !dedication,
    },
    [EditorPhase.MESSAGE]: {
      label: 'Preview',
      action: () => setEditorPhase(EditorPhase.PREVIEW),
      disabled: !editMode || !message,
    },
    [EditorPhase.PREVIEW]: {
      label: 'Share',
      action: () => {
        setEditorPhase(EditorPhase.SHARE)
        share()
      },
      disabled: !editMode,
    },
    [EditorPhase.SHARE]: { label: 'URL Copied', action: share, disabled: !editMode },
  }

  return (
    <div className="fixed inset-0 pointer-events-none font-satisfy text-white text-lg z-99999999">
      {startActionTransition(
        (spring, show) =>
          show && (
            <Button
              className="absolute! bottom-4 left-1/2 -translate-x-1/2 text-2xl w-26"
              style={spring}
              onClick={() => setPhase(DirectionPhase.OPENING)}
            >
              Unfold
            </Button>
          ),
      )}

      {skipActionTransition(
        (spring, show) =>
          show && (
            <Button
              className="absolute! bottom-4 left-1/2 -translate-x-1/2 text-2xl w-26"
              style={spring}
              onClick={() => setPhase(DirectionPhase.END)}
            >
              Skip
            </Button>
          ),
      )}

      {mainMenuTransition(
        (spring, show) =>
          show && (
            <a.div className="absolute inset-4" style={spring}>
              {innerMenuTransition(
                (spring, editing) =>
                  editing && (
                    <a.div className="absolute bottom-0 right-0 flex flex-col gap-2" style={spring}>
                      {editMenuTransition(
                        (spring, preview) =>
                          preview && (
                            <a.div className="flex flex-col gap-2" style={spring}>
                              <Button
                                onClick={() => setOpen(!open)}
                                disabled={!editMode || editorPhase < EditorPhase.PREVIEW}
                              >
                                {open ? 'Fold' : 'Unfold'}
                              </Button>
                              <Button
                                onClick={() => setEditorPhase(EditorPhase.DEDICATION)}
                                disabled={!editMode || editorPhase < EditorPhase.PREVIEW}
                              >
                                Edit
                              </Button>
                            </a.div>
                          ),
                      )}

                      <Button
                        onClick={EDIT_WIZARD[editorPhase].action}
                        disabled={EDIT_WIZARD[editorPhase].disabled}
                      >
                        {EDIT_WIZARD[editorPhase].label}
                      </Button>
                    </a.div>
                  ),
              )}

              {innerMenuTransition((spring, editing) =>
                editing ? (
                  <Button
                    className="absolute! bottom-0"
                    onClick={() => setEditMode(false)}
                    disabled={!editMode}
                    style={spring}
                  >
                    Back
                  </Button>
                ) : (
                  <a.div className="absolute bottom-0 flex flex-col gap-2" style={spring}>
                    <p>
                      Made with ♥︎ by{' '}
                      <a
                        className={clsx(
                          'underline hover:bg-white/20',
                          !editMode && 'pointer-events-auto cursor-pointer',
                        )}
                        target="_blank"
                        href="https://linktr.ee/dammafra"
                      >
                        dammafra
                      </a>
                    </p>
                    <Button onClick={() => setEditMode(true)} disabled={editMode}>
                      Share your greetings
                    </Button>
                    <Button onClick={() => setOpen(!open)} disabled={editMode}>
                      {open ? 'Fold' : 'Unfold'} the greeting card
                    </Button>
                  </a.div>
                ),
              )}

              {innerMenuTransition(
                (spring, editing) =>
                  !editing && (
                    <a.div
                      className="absolute max-md:top-0 md:bottom-0 right-0 text-right"
                      style={spring}
                    >
                      <p>{isTouch ? 'Rotate with one finger' : 'Left click and drag to rotate'}</p>
                      <p>{isTouch ? 'Move with two fingers' : 'Right click and drag to move'}</p>
                      <p>{isTouch ? 'Pinch to zoom' : 'Scroll to zoom'}</p>
                    </a.div>
                  ),
              )}
            </a.div>
          ),
      )}
    </div>
  )
}
