import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Coffee } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useTableStore } from '@/store/tableStore';
import ActiveOrderBanner from '@/components/order/ActiveOrderBanner';

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { categories, loading } = useCategories();
  const tableNumber = useTableStore((s) => s.tableNumber);
  const [search, setSearch] = useState('');

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-full bg-cream-100">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 sticky top-0 bg-cream-100 z-20">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5"
        >
          <p className="font-inter text-sm text-brown-300 mb-0.5">
            {tableNumber ? `Table ${tableNumber}` : 'Tea Time Cafe'}
          </p>
          <h1 className="font-poppins font-bold text-3xl text-charcoal">
            What would you{' '}
            <span className="gradient-text">like? 🍵</span>
          </h1>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="relative"
        >
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-300"
          />
          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl text-sm font-inter text-charcoal placeholder:text-brown-300 shadow-card focus:shadow-card-hover focus:ring-2 focus:ring-amber-tea/30 transition-all"
          />
        </motion.div>
      </div>

      {/* Active Order Live Tracker */}
      <ActiveOrderBanner />

      {/* Categories Grid */}
      <div className="px-5 pb-6">

        {loading ? (
          <div className="grid grid-cols-2 gap-4 mt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton rounded-3xl aspect-[4/3]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Coffee size={48} className="text-brown-300 mb-4" />
            <p className="font-poppins font-medium text-charcoal">No categories found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-2">
            {filtered.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/menu/${category.id}`)}
                className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-card hover:shadow-card-hover transition-shadow group"
              >
                {/* Background image */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brown-DEFAULT/80 via-brown-DEFAULT/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-poppins font-bold text-white text-base leading-tight">
                    {category.name}
                  </h3>
                  <p className="text-white/70 text-xs font-inter mt-0.5">
                    {category.productCount} items
                  </p>
                </div>

                {/* Arrow hint */}
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm">→</span>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
