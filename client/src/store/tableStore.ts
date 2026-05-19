import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TableState {
  tableNumber: number | null;
  tableId: string | null;
  setTable: (number: number, id?: string) => void;
  clearTable: () => void;
}

export const useTableStore = create<TableState>()(
  persist(
    (set) => ({
      tableNumber: null,
      tableId: null,
      setTable: (number, id) => set({ tableNumber: number, tableId: id || null }),
      clearTable: () => set({ tableNumber: null, tableId: null }),
    }),
    {
      name: 'tea-time-table',
      version: 1,
    }
  )
);
