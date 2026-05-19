import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ChefHat, PackageCheck, Truck } from 'lucide-react';
import type { OrderStatus } from '@/types';

const STATUS_CONFIG: Record<OrderStatus, { label: string; description: string; icon: React.ElementType; color: string; bg: string }> = {
  PENDING: {
    label: 'Order Placed',
    description: 'Your order has been received',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  ACCEPTED: {
    label: 'Order Accepted',
    description: 'The kitchen has accepted your order',
    icon: CheckCircle2,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  PREPARING: {
    label: 'Preparing',
    description: 'Your order is being prepared',
    icon: ChefHat,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  READY: {
    label: 'Ready',
    description: 'Your order is ready! Waiter on the way',
    icon: PackageCheck,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  DELIVERED: {
    label: 'Delivered',
    description: 'Enjoy your tea! ☕',
    icon: Truck,
    color: 'text-brown-DEFAULT',
    bg: 'bg-cream-100',
  },
};

const STATUS_ORDER: OrderStatus[] = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'DELIVERED'];

interface OrderStatusStepProps {
  status: OrderStatus;
  currentStatus: OrderStatus;
  index: number;
  estimatedTime?: number;
}

export default function OrderStatusStep({
  status,
  currentStatus,
  index,
  estimatedTime,
}: OrderStatusStepProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const stepIndex = STATUS_ORDER.indexOf(status);
  const isCompleted = stepIndex < currentIndex;
  const isCurrent = stepIndex === currentIndex;
  const isFuture = stepIndex > currentIndex;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex items-start gap-4"
    >
      {/* Icon circle */}
      <div className="flex flex-col items-center">
        <motion.div
          animate={{
            scale: isCurrent ? [1, 1.1, 1] : 1,
          }}
          transition={{
            repeat: isCurrent ? Infinity : 0,
            duration: 2,
            repeatType: 'loop',
          }}
          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
            isCurrent
              ? `${config.bg} ${config.color} shadow-md ring-2 ring-offset-2 ring-amber-tea/40`
              : isCompleted
              ? 'bg-brown-DEFAULT text-white'
              : 'bg-cream-200 text-brown-300'
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 size={20} strokeWidth={2.5} />
          ) : (
            <Icon size={20} strokeWidth={isCurrent ? 2.5 : 1.5} />
          )}
        </motion.div>

        {/* Connector line */}
        {index < STATUS_ORDER.length - 1 && (
          <div className="w-0.5 h-8 mt-1 rounded-full overflow-hidden bg-cream-200">
            <motion.div
              initial={{ height: '0%' }}
              animate={{ height: isCompleted ? '100%' : '0%' }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full bg-brown-DEFAULT"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={`flex-1 pb-6 transition-opacity duration-300 ${isFuture ? 'opacity-40' : ''}`}
      >
        <motion.div
          animate={{
            backgroundColor: isCurrent ? '#FFF8F0' : 'transparent',
          }}
          className="rounded-2xl p-3 -m-3"
        >
          <h3
            className={`font-poppins font-semibold text-base leading-tight ${
              isCurrent ? config.color : isCompleted ? 'text-charcoal' : 'text-brown-300'
            }`}
          >
            {config.label}
          </h3>
          <p className="text-sm text-brown-300 font-inter mt-0.5">
            {config.description}
          </p>
          {isCurrent && status !== 'READY' && status !== 'DELIVERED' && estimatedTime && (
            <div className="flex items-center gap-1 mt-1.5">
              <Clock size={13} className="text-amber-tea" />
              <span className="text-xs font-medium font-inter text-amber-tea">
                ~{estimatedTime} min
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export { STATUS_ORDER };
