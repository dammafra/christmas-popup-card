import { create } from 'zustand'

export enum DirectionPhase {
  LOADING = 1,
  DEDICATION,
  OPENING,
  MESSAGE,
  END,
}

type DirectionStore = {
  phase: DirectionPhase
  setPhase: (phase: DirectionPhase) => void

  open: boolean
  setOpen: (open: boolean) => void
}

export const useDirection = create<DirectionStore>()(set => ({
  phase: DirectionPhase.LOADING,
  setPhase: phase => set(() => ({ phase })),

  open: false,
  setOpen: open => set(() => ({ open })),
}))
