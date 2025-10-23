// Central store for progress per hotspot (0..1)
import { create } from 'zustand';

export type ProgressMap = Record<string, number>;

type ProgressState = {
  progress: ProgressMap;
  setProgress: (id: string, value: number) => void;
  bulkSet?: (incoming: ProgressMap) => void;
};

export const useProgressStore = create<ProgressState>((set) => ({
  progress: {}, // e.g., { play: 0.6, stats: 0.3 }
  setProgress: (id, value) =>
    set((s) => ({ progress: { ...s.progress, [id]: Math.max(0, Math.min(1, value)) } })),
  bulkSet: (incoming) => set(() => ({ progress: { ...incoming } })),
}));
