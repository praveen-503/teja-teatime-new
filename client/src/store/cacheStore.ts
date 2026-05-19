import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CacheEntry {
  data: any;
  expiresAt: number;
}

interface CacheState {
  entries: Record<string, CacheEntry>;
  get: (key: string) => any | null;
  set: (key: string, data: any, ttlMs?: number) => void;
  invalidate: (key: string) => void;
  clearAll: () => void;
}

const DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

export const useCacheStore = create<CacheState>()(
  persist(
    (set, get) => ({
      entries: {},

      get: (key) => {
        const entry = get().entries[key];
        if (!entry) return null;

        const isExpired = Date.now() > entry.expiresAt;
        if (isExpired) {
          // Clean up expired entry asynchronously to keep get pure
          setTimeout(() => get().invalidate(key), 0);
          return null;
        }

        return entry.data;
      },

      set: (key, data, ttlMs = DEFAULT_TTL) => {
        set((state) => ({
          entries: {
            ...state.entries,
            [key]: {
              data,
              expiresAt: Date.now() + ttlMs,
            },
          },
        }));
      },

      invalidate: (key) => {
        set((state) => {
          const newEntries = { ...state.entries };
          delete newEntries[key];
          return { entries: newEntries };
        });
      },

      clearAll: () => set({ entries: {} }),
    }),
    {
      name: 'tea-time-api-cache',
      version: 1,
    }
  )
);
