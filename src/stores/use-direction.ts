import { create } from 'zustand'

export enum Phase {
  LOADING = 1,
  DEDICATION,
  READY,
  OPENING,
  MESSAGE,
  END,
}

type Direction = {
  phase: Phase
  open: boolean

  setPhase: (phase: Phase) => void
  toggleOpen: () => void
}

export const useDirection = create<Direction>()(set => ({
  phase: Phase.LOADING,
  open: false,

  setPhase: phase => set(() => ({ phase })),
  toggleOpen: () => set(state => ({ open: !state.open })),
}))
