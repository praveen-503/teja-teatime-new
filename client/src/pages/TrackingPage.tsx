import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw, Home, Coffee } from 'lucide-react';
import { useOrder } from '@/hooks/useOrder';
import { useSocket } from '@/hooks/useSocket';
import PageHeader from '@/components/layout/PageHeader';
import OrderStatusStep, { STATUS_ORDER } from '@/components/order/OrderStatusStep';
import type { OrderStatus } from '@/types';

export default function TrackingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { order, loading, updateStatus } = useOrder(id!);

  // Real-time updates via Socket.IO
  useSocket({
    rooms: [id!],
    events: {
      'order:updated': (data: unknown) => {
        const update = data as { orderId: string; status: OrderStatus; estimatedTime: number };
        if (update.orderId === id) {
          updateStatus(update.status, update.estimatedTime);
        }
      },
    },
  });

  if (loading) {
    return (
      <div className="min-h-full bg-cream-100 flex flex-col">
        <PageHeader title="Live Tracking" />
        <div className="px-5 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="skeleton w-12 h-12 rounded-full shrink-0" />
              <div className="flex-1 pt-1 space-y-2">
                <div className="skeleton h-4 w-1/2 rounded-lg" />
                <div className="skeleton h-3 w-3/4 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-full bg-cream-100 flex flex-col items-center justify-center gap-4">
        <Coffee size={48} className="text-brown-300" />
        <p className="font-poppins text-charcoal font-medium">Order not found</p>
        <button
          onClick={() => navigate('/menu')}
          className="bg-amber-gradient text-white px-6 py-3 rounded-2xl font-inter font-medium"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  const isDelivered = order.status === 'DELIVERED';

  return (
    <div className="min-h-full bg-cream-100">
      <PageHeader
        title="Live Order Tracking"
        subtitle={`Table ${order.table.number}`}
        rightElement={
          <div
            className={`px-3 py-1.5 rounded-full text-xs font-poppins font-semibold status-${order.status.toLowerCase()}`}
          >
            {order.status}
          </div>
        }
      />

      <div className="px-5">
        {/* Status timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-3xl p-5 shadow-card mb-4"
        >
          {STATUS_ORDER.map((status, index) => (
            <OrderStatusStep
              key={status}
              status={status}
              currentStatus={order.status}
              index={index}
              estimatedTime={order.estimatedTime}
            />
          ))}
        </motion.div>

        {/* Order summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-5 shadow-card mb-4"
        >
          <h3 className="font-poppins font-semibold text-charcoal mb-3">Order Summary</h3>
          <div className="space-y-2.5">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-cream-200 shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-inter font-medium text-sm text-charcoal">
                    {item.product.name} <span className="text-brown-300">×{item.quantity}</span>
                  </p>
                </div>
                <span className="font-poppins font-semibold text-sm text-charcoal">
                  ₹{item.unitPrice * item.quantity}
                </span>
              </div>
            ))}
            <div className="border-t border-cream-200 pt-2.5 mt-2">
              <div className="flex justify-between">
                <span className="font-inter font-medium text-charcoal">Total</span>
                <span className="font-poppins font-bold text-charcoal">₹{order.total}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="space-y-3 pb-4">
          {!isDelivered && (
            <button
              onClick={() => navigate('/waiter')}
              className="w-full bg-brown-DEFAULT text-white font-poppins font-medium py-4 rounded-2xl shadow-tea flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} />
              Call Waiter
            </button>
          )}
          <button
            onClick={() => navigate('/menu')}
            className="w-full bg-white text-charcoal font-inter font-medium py-3.5 rounded-2xl shadow-card flex items-center justify-center gap-2"
          >
            <Home size={16} />
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
