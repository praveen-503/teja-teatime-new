import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OrderStoreState {
  activeOrderId: string | null;
  setActiveOrderId: (id: string | null) => void;
  clearActiveOrder: () => void;
}

export const useOrderStore = create<OrderStoreState>()(
  persist(
    (set) => ({
      activeOrderId: null,
      setActiveOrderId: (id) => set({ activeOrderId: id }),
      clearActiveOrder: () => set({ activeOrderId: null }),
    }),
    {
      name: 'tea-time-active-order',
      version: 1,
    }
  )
);
