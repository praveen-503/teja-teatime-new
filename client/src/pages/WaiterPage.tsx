import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Receipt, UserRound, Package } from 'lucide-react';
import { useTableStore } from '@/store/tableStore';
import { waiterService } from '@/services/waiterService';
import PageHeader from '@/components/layout/PageHeader';
import type { WaiterRequestType } from '@/types';
import toast from 'react-hot-toast';

interface WaiterButton {
  type: WaiterRequestType;
  label: string;
  icon: React.ElementType;
  emoji: string;
  bgColor: string;
  textColor: string;
  description: string;
}

const WAITER_BUTTONS: WaiterButton[] = [
  {
    type: 'WATER',
    label: 'Need Water',
    icon: Droplets,
    emoji: '💧',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    description: 'Request water for the table',
  },
  {
    type: 'BILL',
    label: 'Need Bill',
    icon: Receipt,
    emoji: '🧾',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    description: 'Get the bill for your order',
  },
  {
    type: 'WAITER',
    label: 'Call Waiter',
    icon: UserRound,
    emoji: '🔔',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    description: 'Get assistance from staff',
  },
  {
    type: 'TISSUE',
    label: 'Need Tissue',
    icon: Package,
    emoji: '🧻',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    description: 'Request tissues or napkins',
  },
];

const LOCK_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function WaiterPage() {
  const tableNumber = useTableStore((s) => s.tableNumber);
  const [loading, setLoading] = useState<WaiterRequestType | null>(null);
  
  // Track timestamps of when requests were successfully made
  const [locks, setLocks] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('tea-time-waiter-locks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Dynamic ticking countdown state
  const [now, setNow] = useState(Date.now());

  // Tick every second to update UI timers
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync locks to localStorage
  const saveLock = (type: WaiterRequestType, timestamp: number) => {
    const updated = { ...locks, [type]: timestamp };
    setLocks(updated);
    localStorage.setItem('tea-time-waiter-locks', JSON.stringify(updated));
  };

  const handleRequest = async (type: WaiterRequestType) => {
    if (!tableNumber) {
      toast.error('Table not detected. Please scan the QR code again.');
      return;
    }
    
    // Check lock
    const lastRequest = locks[type] || 0;
    const elapsed = now - lastRequest;
    if (elapsed < LOCK_DURATION) {
      const remainingSeconds = Math.ceil((LOCK_DURATION - elapsed) / 1000);
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      toast.error(`Please wait ${minutes}m ${seconds}s before asking for ${type.toLowerCase()} again.`);
      return;
    }

    if (loading) return;

    setLoading(type);
    try {
      await waiterService.call(tableNumber, type);
      saveLock(type, Date.now());
      toast.success(`${type.charAt(0) + type.slice(1).toLowerCase()} request sent! 👍`);
    } catch {
      toast.error('Failed to send request. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  // Format dynamic remaining time helper
  const getRemainingTime = (type: WaiterRequestType): string | null => {
    const lastRequest = locks[type] || 0;
    const elapsed = now - lastRequest;
    if (elapsed >= LOCK_DURATION) return null;

    const remainingSeconds = Math.ceil((LOCK_DURATION - elapsed) / 1000);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="min-h-full bg-cream-100">
      <PageHeader title="Call Waiter" subtitle={tableNumber ? `Table ${tableNumber}` : undefined} showBack={false} />

      <div className="px-5 pb-6">
        {/* Info banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brown-DEFAULT/10 rounded-2xl px-4 py-3 mb-6 flex items-center gap-3"
        >
          <span className="text-2xl">🫖</span>
          <p className="font-inter text-sm text-brown-DEFAULT leading-relaxed">
            Need help? Tap any request below. Each button can be used once every 5 minutes.
          </p>
        </motion.div>

        {/* Buttons grid */}
        <div className="grid grid-cols-2 gap-4">
          {WAITER_BUTTONS.map((btn, index) => {
            const Icon = btn.icon;
            const isLoading = loading === btn.type;
            const remaining = getRemainingTime(btn.type);
            const isLocked = !!remaining;

            return (
              <motion.button
                key={btn.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={isLocked ? {} : { scale: 1.02 }}
                whileTap={isLocked ? {} : { scale: 0.96 }}
                onClick={() => handleRequest(btn.type)}
                disabled={!!loading || isLocked}
                className={`relative ${btn.bgColor} rounded-3xl p-5 flex flex-col items-center gap-3 shadow-card hover:shadow-card-hover transition-all min-h-[150px] justify-center overflow-hidden border-2 ${
                  isLocked ? 'border-amber-tea/20 opacity-75' : 'border-transparent'
                }`}
              >
                {/* Lock Overlay with Blur & Live Timer */}
                <AnimatePresence>
                  {isLocked && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white/80 backdrop-blur-[3px] flex flex-col items-center justify-center rounded-3xl z-10"
                    >
                      <motion.span
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="text-2xl mb-1"
                      >
                        ⏳
                      </motion.span>
                      <span className="font-poppins font-bold text-sm text-charcoal">
                        Locked
                      </span>
                      <span className="font-inter text-xs text-amber-tea font-semibold mt-0.5 bg-amber-tea/10 px-2 py-0.5 rounded-full">
                        {remaining}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isLoading ? (
                  <div className={`w-12 h-12 rounded-full border-3 border-current border-t-transparent animate-spin ${btn.textColor}`} />
                ) : (
                  <>
                    <span className="text-4xl">{btn.emoji}</span>
                    <Icon size={0} className="hidden" />
                  </>
                )}

                <div className="text-center">
                  <p className={`font-poppins font-semibold text-base ${btn.textColor}`}>
                    {btn.label}
                  </p>
                  <p className="font-inter text-xs text-brown-300 mt-0.5">
                    {btn.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Lock note */}
        <p className="text-center font-inter text-xs text-brown-300 mt-6 px-4">
          ⚠️ Time restrictions prevent spamming and ensure the staff can assist all tables efficiently.
        </p>
      </div>
    </div>
  );
}
