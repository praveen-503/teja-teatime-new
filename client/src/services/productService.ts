import api from './api';
import type { ApiResponse, Product } from '@/types';
import { useCacheStore } from '@/store/cacheStore';

export const productService = {
  getAll: async (params?: { categoryId?: string; search?: string }): Promise<Product[]> => {
    const cat = params?.categoryId || 'all';
    const q = params?.search || '';
    const cacheKey = `products_cat_${cat}_q_${q}`;

    // 1. Check Cache
    const cached = useCacheStore.getState().get(cacheKey);
    if (cached) {
      return cached as Product[];
    }

    // 2. Fetch fresh
    const res = await api.get<ApiResponse<Product[]>>('/products', { params });
    const products = res.data.data;

    // 3. Cache it (30 min TTL)
    useCacheStore.getState().set(cacheKey, products);

    return products;
  },

  getById: async (id: string): Promise<Product> => {
    const cacheKey = `product_${id}`;

    // 1. Check Cache
    const cached = useCacheStore.getState().get(cacheKey);
    if (cached) {
      return cached as Product;
    }

    // 2. Fetch fresh
    const res = await api.get<ApiResponse<Product>>(`/products/${id}`);
    const product = res.data.data;

    // 3. Cache it (30 min TTL)
    useCacheStore.getState().set(cacheKey, product);

    return product;
  },

  // Manual cache invalidation
  invalidateProductsCache: () => {
    useCacheStore.getState().clearAll();
  }
};
