import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Star, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const defaultSugarLevel = product.sugarLevels[2] || product.sugarLevels[0] || undefined;
  const defaultSpiceLevel = product.spiceLevels[1] || product.spiceLevels[0] || undefined;
  const defaultCartItemId = `${product.id}__${defaultSugarLevel || ''}__${defaultSpiceLevel || ''}__`;

  const cartItem = items.find((item) => item.cartItemId === defaultCartItemId);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      sugarLevel: defaultSugarLevel,
      spiceLevel: defaultSpiceLevel,
      selectedAddons: [],
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.cartItemId, cartItem.quantity + 1);
    } else {
      handleQuickAdd(e);
    }
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cartItem) return;

    if (cartItem.quantity === 1) {
      removeItem(cartItem.cartItemId);
      toast.success(`${product.name} removed from cart`);
      return;
    }

    updateQuantity(cartItem.cartItemId, cartItem.quantity - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-cream-200">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Veg indicator */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-1.5 py-1">
          <span className="veg-dot" />
        </div>

        {/* Rating badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
          <Star size={11} className="text-amber-tea fill-amber-tea" />
          <span className="text-xs font-semibold text-charcoal font-poppins">
            {product.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <h3 className="font-poppins font-semibold text-charcoal text-base leading-tight mb-1 truncate">
          {product.name}
        </h3>
        <p className="text-xs text-brown-300 font-inter line-clamp-2 mb-3 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-poppins font-bold text-lg text-charcoal">
              ₹{product.price}
            </span>
          </div>

          {cartItem ? (
            <div className="flex items-center gap-1.5 bg-cream-100 rounded-2xl px-2 py-1">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleDecrease}
                className="w-7 h-7 flex items-center justify-center text-brown-500 hover:text-red-500 transition-colors"
                aria-label={cartItem.quantity === 1 ? `Remove ${product.name} from cart` : `Decrease ${product.name} quantity`}
              >
                {cartItem.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
              </motion.button>

              <span className="font-poppins font-semibold text-sm text-charcoal w-5 text-center">
                {cartItem.quantity}
              </span>

              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleIncrease}
                className="w-7 h-7 flex items-center justify-center text-brown-500 hover:text-amber-tea transition-colors"
                aria-label={`Increase ${product.name} quantity`}
              >
                <Plus size={14} />
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleQuickAdd}
              className="flex items-center justify-center w-9 h-9 bg-amber-tea rounded-xl text-white shadow-primary hover:bg-amber-light transition-colors"
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus size={18} strokeWidth={2.5} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
