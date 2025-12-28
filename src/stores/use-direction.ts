import { create } from 'zustand'

export enum Phase {
  LOADING = 1,
  READY,
  OPENING,
  OPEN,
  MESSAGE,
  END,
}

type Direction = {
  phase: Phase
  setPhase: (phase: Phase) => void
}

export const useDirection = create<Direction>()(set => ({
  phase: Phase.LOADING,
  setPhase: phase => set(() => ({ phase })),
}))
