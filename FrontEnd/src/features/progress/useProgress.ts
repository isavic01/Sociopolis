// Convenience hook to read & update progress without exposing store mechanics
import { useCallback } from 'react';
import { useProgressStore } from './progressStore';

export function useProgress(id?: string) {
  const map = useProgressStore((s) => s.progress);
  const set = useProgressStore((s) => s.setProgress);

  const value = id ? map[id] ?? 0 : undefined;
  const setValue = useCallback((v: number) => id && set(id, v), [id, set]);

  return { progressMap: map, value, setValue };
}
