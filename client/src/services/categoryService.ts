import api from './api';
import type { ApiResponse, Category } from '@/types';
import { useCacheStore } from '@/store/cacheStore';

const CATEGORIES_CACHE_KEY = 'api_categories';

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    // 1. Check local cache first
    const cached = useCacheStore.getState().get(CATEGORIES_CACHE_KEY);
    if (cached) {
      return cached as Category[];
    }

    // 2. Fetch fresh data if cache is empty or expired
    const res = await api.get<ApiResponse<Category[]>>('/categories');
    const categories = res.data.data;

    // 3. Store in cache (30 mins TTL)
    useCacheStore.getState().set(CATEGORIES_CACHE_KEY, categories);

    return categories;
  },

  // Manual cache invalidation when refreshing is needed
  clearCache: () => {
    useCacheStore.getState().invalidate(CATEGORIES_CACHE_KEY);
  }
};
