import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ArrowRight, Coffee } from 'lucide-react';
import { useOrder } from '@/hooks/useOrder';

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { order, loading } = useOrder(id!);

  if (loading) {
    return (
      <div className="min-h-full bg-amber-tea flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-amber-gradient flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Floating circles decoration */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.6 }}
          className="absolute rounded-full bg-white"
          style={{
            width: `${[80, 120, 60, 100, 50, 90][i]}px`,
            height: `${[80, 120, 60, 100, 50, 90][i]}px`,
            top: `${[10, 5, 70, 80, 30, 60][i]}%`,
            left: `${[10, 75, 5, 80, 50, 40][i]}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Tea cup illustration */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
        className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 relative"
      >
        <Coffee size={56} className="text-white" strokeWidth={1.5} />

        {/* Steam animations */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.8, 0], y: -30 }}
            transition={{
              duration: 2,
              delay: i * 0.4,
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
            className="absolute text-white/60 text-xl"
            style={{ top: '-10px', left: `${30 + i * 15}%` }}
          >
            ~
          </motion.div>
        ))}
      </motion.div>

      {/* Success check */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.3 }}
        className="mb-4"
      >
        <CheckCircle2 size={32} className="text-white" fill="rgba(255,255,255,0.3)" strokeWidth={2} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-poppins font-bold text-3xl text-white text-center mb-2"
      >
        Order Placed! 🎉
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="font-inter text-white/80 text-center mb-8"
      >
        Your order has been received. Sit back and relax!
      </motion.p>

      {/* Info cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full space-y-3 mb-8"
      >
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-4 flex items-center gap-4">
          <Clock size={24} className="text-white" />
          <div>
            <p className="font-inter text-xs text-white/70">Estimated preparation</p>
            <p className="font-poppins font-bold text-white text-lg">
              ~{order?.estimatedTime || 15} minutes
            </p>
          </div>
        </div>

        {order && (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-4 flex items-center gap-4">
            <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center text-white font-bold text-sm">
              #
            </div>
            <div>
              <p className="font-inter text-xs text-white/70">Order total</p>
              <p className="font-poppins font-bold text-white text-lg">₹{order.total}</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full space-y-3"
      >
        <button
          onClick={() => navigate(`/tracking/${id}`)}
          className="w-full bg-white text-amber-tea font-poppins font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg"
        >
          <span>Track Live Order</span>
          <ArrowRight size={18} />
        </button>

        <button
          onClick={() => navigate('/menu')}
          className="w-full bg-white/20 text-white font-inter font-medium py-3.5 rounded-2xl"
        >
          Back to Menu
        </button>
      </motion.div>
    </div>
  );
}
