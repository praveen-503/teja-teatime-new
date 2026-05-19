import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Clock, ChevronRight, Trash2, MapPin, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useTableStore } from '@/store/tableStore';
import { useOrderStore } from '@/store/orderStore';
import { orderService } from '@/services/orderService';
import CartItemComponent from '@/components/cart/CartItem';
import EmptyState from '@/components/common/EmptyState';
import PageHeader from '@/components/layout/PageHeader';
import toast from 'react-hot-toast';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, totalPrice, totalItems, clearCart } = useCartStore();
  const tableNumber = useTableStore((s) => s.tableNumber);
  const setActiveOrderId = useOrderStore((s) => s.setActiveOrderId);
  const [notes, setNotes] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);

  const subtotal = totalPrice();
  const count = totalItems();

  const handlePlaceOrder = async () => {
    // Guard: must have a table number
    if (!tableNumber) {
      toast.error('Please scan the QR code on your table first!', { duration: 4000 });
      navigate('/table/1');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    setIsPlacing(true);

    try {
      const order = await orderService.create({
        tableNumber,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          sugarLevel: item.sugarLevel,
          spiceLevel: item.spiceLevel,
          addons: item.selectedAddons.map((a) => a.name),
        })),
        notes: notes.trim() || undefined,
      });

      clearCart();
      setActiveOrderId(order.id);
      toast.success('Order placed! Kitchen is notified 🍵');
      navigate(`/order-success/${order.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to place order';
      toast.error(msg);
      setIsPlacing(false);
    }
  };

  return (
    <div className="min-h-full bg-cream-100">
      <PageHeader
        title="Your Cart"
        subtitle={count > 0 ? `${count} item${count > 1 ? 's' : ''}` : undefined}
        rightElement={
          count > 0 ? (
            <button
              onClick={() => { clearCart(); toast('Cart cleared', { icon: '🗑️' }); }}
              className="flex items-center gap-1.5 text-red-400 text-sm font-inter"
            >
              <Trash2 size={14} />
              Clear
            </button>
          ) : undefined
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart size={48} />}
          title="Your cart is empty"
          description="Add some premium teas or snacks from the menu to get started."
          action={
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/menu')}
              className="bg-amber-gradient text-white font-poppins font-semibold px-8 py-3.5 rounded-2xl shadow-primary"
            >
              Browse Menu
            </motion.button>
          }
        />
      ) : (
        <>
          <div className="px-5 space-y-3 pb-[200px]">

            {/* Table indicator */}
            {tableNumber ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 bg-brown-DEFAULT/10 rounded-2xl px-4 py-3"
              >
                <div className="flex items-center gap-2 flex-1">
                  <MapPin size={16} className="text-amber-tea shrink-0" />
                  <span className="font-inter text-sm text-brown-DEFAULT font-medium">
                    Ordering for <strong>Table {tableNumber}</strong>
                  </span>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-2xl px-4 py-3"
              >
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <span className="font-inter text-sm text-red-500">
                  No table detected. Please scan the QR code on your table.
                </span>
              </motion.div>
            )}

            {/* Cart items */}
            <AnimatePresence mode="sync">
              {items.map((item, index) => (
                <CartItemComponent key={item.cartItemId} item={item} index={index} />
              ))}
            </AnimatePresence>

            {/* Order Notes */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-5 shadow-card"
            >
              <h3 className="font-poppins font-semibold text-charcoal mb-3">
                Special Instructions
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Less sweet, extra hot, no ice..."
                rows={3}
                className="w-full bg-cream-100 rounded-2xl p-3.5 text-sm font-inter text-charcoal placeholder:text-brown-300 resize-none focus:ring-2 focus:ring-amber-tea/30 transition-all"
              />
            </motion.div>

            {/* Bill breakdown */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-5 shadow-card"
            >
              <h3 className="font-poppins font-semibold text-charcoal mb-4">Bill Summary</h3>
              <div className="space-y-2">
                {items.map((item) => {
                  const addonTotal = item.selectedAddons.reduce((s, a) => s + a.price, 0);
                  const lineTotal = (item.price + addonTotal) * item.quantity;
                  return (
                    <div key={item.cartItemId} className="flex justify-between text-sm">
                      <span className="font-inter text-brown-300">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-poppins font-medium text-charcoal">₹{lineTotal}</span>
                    </div>
                  );
                })}
                <div className="border-t border-cream-200 pt-3 mt-3 flex justify-between">
                  <span className="font-inter font-medium text-charcoal">Total</span>
                  <span className="font-poppins font-bold text-xl text-charcoal">₹{subtotal}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-cream-200">
                <div className="flex items-center gap-2 text-brown-300">
                  <Clock size={14} className="text-amber-tea" />
                  <span className="font-inter text-sm">Estimated time</span>
                </div>
                <span className="font-poppins font-semibold text-sm text-charcoal">~15 min</span>
              </div>
            </motion.div>
          </div>

          {/* Sticky checkout bar */}
          <div className="fixed bottom-[64px] left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/98 backdrop-blur-md border-t border-cream-200 px-5 pt-4 pb-4 z-40 shadow-bottom-nav">
            <div className="flex items-baseline justify-between mb-3 px-1">
              <div>
                <p className="font-inter text-xs text-brown-300">Order Total</p>
                <p className="font-poppins font-bold text-2xl text-charcoal leading-tight">₹{subtotal}</p>
              </div>
              <p className="font-inter text-xs text-brown-300">{count} item{count > 1 ? 's' : ''}</p>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handlePlaceOrder}
              disabled={isPlacing}
              className="w-full bg-amber-gradient text-white font-poppins font-semibold py-4 rounded-2xl shadow-primary flex items-center justify-between px-6 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2">
                {isPlacing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    <span>Place Order</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold">₹{subtotal}</span>
                {!isPlacing && <ChevronRight size={18} />}
              </div>
            </motion.button>

            <p className="text-center font-inter text-xs text-brown-300 mt-2">
              🔒 Order sent directly to kitchen
            </p>
          </div>
        </>
      )}
    </div>
  );
}
