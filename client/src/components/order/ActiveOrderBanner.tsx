import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Clock, ChefHat, PackageCheck, CheckCircle2 } from 'lucide-react';
import { useOrderStore } from '@/store/orderStore';
import { orderService } from '@/services/orderService';
import { useSocket } from '@/hooks/useSocket';
import type { OrderStatus } from '@/types';

const STATUS_UI: Record<OrderStatus, { label: string; icon: React.ElementType; color: string; bg: string; pulse: boolean }> = {
  PENDING:   { label: 'Order Received',  icon: Clock,          color: 'text-amber-600',  bg: 'bg-amber-50',  pulse: true  },
  ACCEPTED:  { label: 'Order Accepted',  icon: CheckCircle2,   color: 'text-blue-600',   bg: 'bg-blue-50',   pulse: false },
  PREPARING: { label: 'Preparing...',    icon: ChefHat,        color: 'text-orange-600', bg: 'bg-orange-50', pulse: true  },
  READY:     { label: 'Ready for You!',  icon: PackageCheck,   color: 'text-green-600',  bg: 'bg-green-50',  pulse: false },
  DELIVERED: { label: 'Delivered! Enjoy 🍵', icon: CheckCircle2, color: 'text-brown-DEFAULT', bg: 'bg-cream-200', pulse: false },
};

export default function ActiveOrderBanner() {
  const navigate = useNavigate();
  const { activeOrderId, clearActiveOrder } = useOrderStore();
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number>(15);
  const [visible, setVisible] = useState(false);

  // Load order status on mount
  useEffect(() => {
    if (!activeOrderId) return;
    orderService
      .getById(activeOrderId)
      .then((order) => {
        setStatus(order.status);
        setEstimatedTime(order.estimatedTime);
        // Auto-clear if already delivered
        if (order.status === 'DELIVERED') {
          setTimeout(() => {
            clearActiveOrder();
          }, 6000);
        }
        setVisible(true);
      })
      .catch(() => {
        // Order not found — clear stale reference
        clearActiveOrder();
      });
  }, [activeOrderId, clearActiveOrder]);

  // Real-time status updates
  useSocket({
    rooms: activeOrderId ? [activeOrderId] : [],
    events: {
      'order:updated': (data: unknown) => {
        const update = data as { orderId: string; status: OrderStatus; estimatedTime: number };
        if (update.orderId === activeOrderId) {
          setStatus(update.status);
          setEstimatedTime(update.estimatedTime);
          if (update.status === 'DELIVERED') {
            setTimeout(() => clearActiveOrder(), 6000);
          }
        }
      },
    },
  });

  if (!activeOrderId || !status || !visible) return null;

  const ui = STATUS_UI[status];
  const Icon = ui.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        onClick={() => navigate(`/tracking/${activeOrderId}`)}
        className={`mx-5 mb-4 rounded-2xl ${ui.bg} border border-white/60 shadow-card cursor-pointer overflow-hidden`}
      >
        <div className="flex items-center gap-3 px-4 py-3.5">
          {/* Icon with optional pulse */}
          <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/70 ${ui.color} shrink-0`}>
            <Icon size={20} strokeWidth={2} />
            {ui.pulse && (
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute inset-0 rounded-xl ${ui.bg} border-2 ${ui.color.replace('text-', 'border-')}`}
              />
            )}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className={`font-poppins font-semibold text-sm leading-tight ${ui.color}`}>
              {ui.label}
            </p>
            <p className="font-inter text-xs text-brown-300 mt-0.5">
              {status === 'DELIVERED'
                ? 'Order complete — tap to view summary'
                : status === 'READY'
                ? 'Waiter is on the way!'
                : `Est. ~${estimatedTime} min remaining`}
            </p>
          </div>

          {/* Track link */}
          <div className="flex items-center gap-1 shrink-0">
            <span className={`font-inter text-xs font-medium ${ui.color}`}>Track</span>
            <ChevronRight size={14} className={ui.color} />
          </div>
        </div>

        {/* Progress bar */}
        {status !== 'DELIVERED' && (
          <div className="h-1 bg-white/40 mx-4 mb-3 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${
                  status === 'PENDING' ? 15 :
                  status === 'ACCEPTED' ? 35 :
                  status === 'PREPARING' ? 65 :
                  status === 'READY' ? 90 : 100
                }%`,
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                status === 'READY' ? 'bg-green-500' :
                status === 'PREPARING' ? 'bg-orange-500' :
                status === 'ACCEPTED' ? 'bg-blue-500' : 'bg-amber-500'
              }`}
            />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
