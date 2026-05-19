import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import type { CartItem } from '@/types';

interface CartItemProps {
  item: CartItem;
  index: number;
}

export default function CartItemComponent({ item, index }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const itemTotal = (item.price + item.selectedAddons.reduce((s, a) => s + a.price, 0)) * item.quantity;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
      className="bg-white rounded-3xl p-4 shadow-card flex gap-4"
    >
      {/* Image */}
      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-cream-200">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-poppins font-semibold text-charcoal text-sm leading-tight">
            {item.name}
          </h3>
          <button
            onClick={() => removeItem(item.cartItemId)}
            className="text-red-400 hover:text-red-600 transition-colors shrink-0 p-0.5"
            aria-label="Remove item"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* Customizations */}
        <div className="flex flex-wrap gap-1 mt-1 mb-2">
          {item.sugarLevel && (
            <span className="text-[10px] bg-cream-100 text-brown-500 px-2 py-0.5 rounded-full font-inter">
              {item.sugarLevel}
            </span>
          )}
          {item.spiceLevel && (
            <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-inter">
              {item.spiceLevel}
            </span>
          )}
          {item.selectedAddons.map((addon) => (
            <span key={addon.name} className="text-[10px] bg-brown-50 text-brown-500 px-2 py-0.5 rounded-full font-inter">
              +{addon.name}
            </span>
          ))}
        </div>

        {/* Price + Quantity */}
        <div className="flex items-center justify-between">
          <span className="font-poppins font-bold text-charcoal text-sm">
            ₹{itemTotal}
          </span>

          <div className="flex items-center gap-2 bg-cream-100 rounded-2xl px-2 py-1">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
              className="w-6 h-6 flex items-center justify-center text-brown-500 hover:text-brown-DEFAULT transition-colors"
            >
              {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
            </motion.button>

            <span className="font-poppins font-semibold text-sm text-charcoal w-5 text-center">
              {item.quantity}
            </span>

            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
              className="w-6 h-6 flex items-center justify-center text-brown-500 hover:text-amber-tea transition-colors"
            >
              <Plus size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
