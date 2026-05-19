import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import ProductCard from '@/components/product/ProductCard';
import ProductSkeleton from '@/components/product/ProductSkeleton';
import PageHeader from '@/components/layout/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { Coffee } from 'lucide-react';

export default function ProductListPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [search, setSearch] = useState('');
  const { products, loading } = useProducts({ categoryId, search: search || undefined });
  const { categories } = useCategories();

  const categoryName = categories.find((c) => c.id === categoryId)?.name || 'Products';

  return (
    <div className="min-h-full bg-cream-100">
      <PageHeader
        title={categoryName}
        subtitle={!loading ? `${products.length} items available` : undefined}
      />

      {/* Search bar */}
      <div className="px-5 pb-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-300" />
          <input
            type="text"
            placeholder={`Search in ${categoryName}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-12 py-3.5 bg-white rounded-2xl text-sm font-inter text-charcoal placeholder:text-brown-300 shadow-card focus:ring-2 focus:ring-amber-tea/30 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-cream-200 rounded-xl flex items-center justify-center">
              <SlidersHorizontal size={14} className="text-brown-300" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Products grid */}
      <div className="px-5">


        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={<Coffee size={40} />}
            title="No products found"
            description={
              search
                ? `No results for "${search}". Try a different search.`
                : 'No products available in this category right now.'
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
