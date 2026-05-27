import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Addon } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  // Computed
  totalItems: () => number;
  totalPrice: () => number;
}

function computeItemPrice(item: CartItem): number {
  const addonsTotal = item.selectedAddons.reduce((sum: number, addon: Addon) => sum + addon.price, 0);
  return (item.price + addonsTotal) * item.quantity;
}

function generateCartItemId(item: Omit<CartItem, 'cartItemId'>): string {
  const addonNames = item.selectedAddons.map((a) => a.name).sort().join(',');
  return `${item.productId}__${item.sugarLevel || ''}__${item.spiceLevel || ''}__${addonNames}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const cartItemId = generateCartItemId(newItem);
        set((state) => {
          const existing = state.items.find((i) => i.cartItemId === cartItemId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.cartItemId === cartItemId
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { ...newItem, cartItemId }],
          };
        });
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.length,

      totalPrice: () => get().items.reduce((sum, item) => sum + computeItemPrice(item), 0),
    }),
    {
      name: 'tea-time-cart',
      version: 1,
    }
  )
);
