import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coffee, MapPin, ChevronRight, Sparkles } from 'lucide-react';
import { useTableStore } from '@/store/tableStore';

export default function WelcomePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const setTable = useTableStore((state) => state.setTable);
  const [isReady, setIsReady] = useState(false);

  const tableNumber = parseInt(id || '1', 10);

  useEffect(() => {
    if (!isNaN(tableNumber)) {
      setTable(tableNumber);
    }
    // Small delay for entrance animation
    const t = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(t);
  }, [tableNumber, setTable]);

  if (!isReady) return null;

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-brown-DEFAULT overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 z-0 bg-brown-DEFAULT/60" />
      <div className="absolute inset-0 z-0 bg-hero-gradient" />

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 px-6 py-12">
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col items-center mt-8"
        >
          <div className="w-20 h-20 bg-amber-tea/20 backdrop-blur-sm border border-amber-tea/30 rounded-3xl flex items-center justify-center mb-4 shadow-2xl">
            <Coffee size={40} className="text-amber-tea" strokeWidth={1.5} />
          </div>
          <h1 className="font-poppins font-bold text-5xl text-white tracking-tight">
            Tea Time
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <Sparkles size={13} className="text-amber-tea" />
            <p className="font-inter text-sm text-white/70 tracking-widest uppercase">
              Premium Cafe
            </p>
            <Sparkles size={13} className="text-amber-tea" />
          </div>
        </motion.div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="glass rounded-[2rem] p-8 mb-6"
        >
          {/* Table number */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-tea/20 rounded-2xl flex items-center justify-center">
              <MapPin size={18} className="text-amber-tea" />
            </div>
            <div>
              <p className="font-inter text-xs text-white/60 uppercase tracking-widest">
                You are at
              </p>
              <p className="font-poppins font-bold text-2xl text-white leading-tight">
                Table {tableNumber}
              </p>
            </div>
          </div>

          {/* Tagline */}
          <p className="font-inter text-white/75 text-sm leading-relaxed mb-8">
            Browse our premium menu of handcrafted teas, freshly made snacks, and artisanal beverages — all made with love. 🫖
          </p>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/menu')}
            className="w-full bg-amber-gradient text-white font-poppins font-semibold py-4 rounded-2xl shadow-primary flex items-center justify-between px-6 text-base"
          >
            <span>Scan & Order Instantly</span>
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
              <ChevronRight size={18} />
            </div>
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-white/40 text-xs font-inter"
        >
          Powered by Tea Time POS System
        </motion.p>
      </div>
    </div>
  );
}
