import { create } from 'zustand'

type EditorFocus = 'dedication' | 'message' | 'share'

type EditorStore = {
  enabled: boolean
  setEnabled: (enabled: boolean) => void

  focus: EditorFocus
  setFocus: (focus: EditorFocus) => void

  dedication: string
  setDedication: (dedication: string) => void

  message: string
  setMessage: (dedication: string) => void
}

export const useEditor = create<EditorStore>()(set => ({
  enabled: false,
  setEnabled: enabled => set(() => ({ enabled, focus: 'dedication' })),

  focus: 'dedication',
  setFocus: focus => set(() => ({ focus })),

  dedication: '',
  setDedication: dedication => set(() => ({ dedication })),

  message: '',
  setMessage: message => set(() => ({ message })),
}))
