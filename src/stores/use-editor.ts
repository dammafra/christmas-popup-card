import { create } from 'zustand'

function sanitize(string: string) {
  return string
    .replaceAll(/à|á/g, "a'")
    .replaceAll(/è|é/g, "e'")
    .replaceAll(/ì|í/g, "i'")
    .replaceAll(/ò|ó/g, "o'")
    .replaceAll(/ù|ú/g, "u'")
    .replaceAll(/À|Á/g, "A'")
    .replaceAll(/È|É/g, "E'")
    .replaceAll(/Ì|Í/g, "I'")
    .replaceAll(/Ò|Ó/g, "O'")
    .replaceAll(/Ù|Ú/g, "U'")
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .normalize('NFC')
    .replace(
      /[^\x00-\x7F~`!@#$%^&*()_+\-={}$begin:math:display$$end:math:display$:"<>?;',./\\|]/g,
      '',
    )
}

export enum EditorPhase {
  DEDICATION = 1,
  MESSAGE,
  PREVIEW,
  SHARE,
}

type EditorStore = {
  enabled: boolean
  setEnabled: (enabled: boolean) => void

  phase: EditorPhase
  setPhase: (focus: EditorPhase) => void

  dedication: string
  setDedication: (dedication: string) => void

  message: string
  setMessage: (dedication: string) => void
}

export const useEditor = create<EditorStore>()(set => ({
  enabled: false,
  setEnabled: enabled => {
    set(() => ({
      enabled,
      phase: EditorPhase.DEDICATION,
      dedication: '',
      message: '',
    }))
  },

  phase: EditorPhase.DEDICATION,
  setPhase: phase => set(() => ({ phase })),

  dedication: '',
  setDedication: dedication => set(() => ({ dedication: sanitize(dedication) })),

  message: '',
  setMessage: message => set(() => ({ message: sanitize(message) })),
}))
