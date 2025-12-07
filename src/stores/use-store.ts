import { create } from 'zustand'

type Store = {
  value?: unknown
  setValue: (value: unknown) => void
}

export const useStore = create<Store>()(set => ({
  setValue: value => set(state => ({ value: state.value || value })),
}))
