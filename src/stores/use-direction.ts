import { create } from 'zustand'

export enum Phase {
  LOADING = 1,
  DEDICATION,
  READY,
  OPENING,
  MESSAGE,
  END,
}

type DirectionStore = {
  phase: Phase
  setPhase: (phase: Phase) => void

  open: boolean
  setOpen: (open: boolean) => void
}

export const useDirection = create<DirectionStore>()(set => ({
  phase: Phase.LOADING,
  setPhase: phase => set(() => ({ phase })),

  open: false,
  setOpen: open => set(() => ({ open })),
}))
