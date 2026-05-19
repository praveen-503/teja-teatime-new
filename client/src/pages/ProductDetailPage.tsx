import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Plus, Minus, ShoppingCart, ChevronLeft } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import type { Addon } from '@/types';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading } = useProduct(id!);
  const addItem = useCartStore((state) => state.addItem);

  const [quantity, setQuantity] = useState(1);
  const [selectedSugar, setSelectedSugar] = useState<string>('');
  const [selectedSpice, setSelectedSpice] = useState<string>('');
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);

  if (loading) {
    return (
      <div className="min-h-full bg-cream-100 animate-pulse">
        <div className="skeleton h-72 w-full" />
        <div className="p-5 space-y-4">
          <div className="skeleton h-8 w-3/4 rounded-xl" />
          <div className="skeleton h-4 w-full rounded-xl" />
          <div className="skeleton h-4 w-5/6 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <p className="text-brown-300 font-inter">Product not found.</p>
      </div>
    );
  }

  const productAddons = Array.isArray(product.addons) ? product.addons : [];

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.name === addon.name)
        ? prev.filter((a) => a.name !== addon.name)
        : [...prev, addon]
    );
  };

  const addonTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = (product.price + addonTotal) * quantity;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      sugarLevel: selectedSugar || undefined,
      spiceLevel: selectedSpice || undefined,
      selectedAddons,
    });
    toast.success(`${product.name} added to cart!`);
    navigate(-1);
  };

  return (
    <div className="min-h-full bg-cream-100 pb-32">
      {/* Hero Image */}
      <div className="relative h-72 bg-cream-200 overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream-100/60 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-10 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-card"
        >
          <ChevronLeft size={20} strokeWidth={2.5} className="text-charcoal" />
        </button>

        {/* Rating */}
        <div className="absolute top-10 right-4 bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2 flex items-center gap-1.5 shadow-card">
          <Star size={14} className="text-amber-tea fill-amber-tea" />
          <span className="font-poppins font-semibold text-sm text-charcoal">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-brown-300">({product.reviewCount})</span>
        </div>
      </div>

      {/* Product info */}
      <div className="px-5 pt-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <h1 className="font-poppins font-bold text-2xl text-charcoal leading-tight flex-1">
              {product.name}
            </h1>
            <div className="text-right shrink-0">
              <span className="font-poppins font-bold text-2xl text-charcoal">
                ₹{product.price}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="veg-dot" />
            <span className="text-xs text-green-600 font-inter font-medium">Pure Veg</span>
            <span className="text-brown-300">•</span>
            <span className="text-xs text-brown-300 font-inter">{product.category.name}</span>
          </div>

          <p className="font-inter text-sm text-brown-500 leading-relaxed mb-6">
            {product.description}
          </p>
        </motion.div>

        {/* Sugar Level */}
        {product.sugarLevels.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-5"
          >
            <h3 className="font-poppins font-semibold text-base text-charcoal mb-3">
              Sugar Level
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.sugarLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedSugar(selectedSugar === level ? '' : level)}
                  className={`px-4 py-2 rounded-2xl text-sm font-inter font-medium transition-all ${
                    selectedSugar === level
                      ? 'bg-brown-DEFAULT text-white shadow-tea'
                      : 'bg-white text-brown-300 shadow-card'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Spice Level */}
        {product.spiceLevels.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-5"
          >
            <h3 className="font-poppins font-semibold text-base text-charcoal mb-3">
              Spice Level
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.spiceLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedSpice(selectedSpice === level ? '' : level)}
                  className={`px-4 py-2 rounded-2xl text-sm font-inter font-medium transition-all ${
                    selectedSpice === level
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-white text-brown-300 shadow-card'
                  }`}
                >
                  🌶 {level}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Add-ons */}
        {productAddons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-5"
          >
            <h3 className="font-poppins font-semibold text-base text-charcoal mb-3">
              Add-ons
            </h3>
            <div className="space-y-2">
              {productAddons.map((addon: Addon) => {
                const selected = selectedAddons.some((a) => a.name === addon.name);
                return (
                  <button
                    key={addon.name}
                    onClick={() => toggleAddon(addon)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                      selected
                        ? 'bg-amber-tea/10 border-2 border-amber-tea'
                        : 'bg-white shadow-card border-2 border-transparent'
                    }`}
                  >
                    <span className={`font-inter text-sm font-medium ${selected ? 'text-charcoal' : 'text-brown-300'}`}>
                      {addon.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-poppins font-semibold text-sm text-amber-tea">
                        +₹{addon.price}
                      </span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selected ? 'bg-amber-tea border-amber-tea' : 'border-brown-300'
                      }`}>
                        {selected && <span className="text-white text-xs font-bold">✓</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-cream-100/95 backdrop-blur-md border-t border-cream-200 px-5 py-4 z-40">
        <div className="flex items-center gap-4">
          {/* Quantity */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-3 py-2 shadow-card">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center text-brown-DEFAULT"
            >
              <Minus size={16} />
            </button>
            <span className="font-poppins font-bold text-lg text-charcoal w-6 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-amber-tea"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Add to cart */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            className="flex-1 bg-amber-gradient text-white font-poppins font-semibold py-3.5 rounded-2xl shadow-primary flex items-center justify-between px-5"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} />
              <span>Add to Cart</span>
            </div>
            <span className="font-bold">₹{totalPrice}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
