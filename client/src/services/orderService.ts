import api from './api';
import type { ApiResponse, Order, CreateOrderPayload } from '@/types';

export const orderService = {
  create: async (payload: CreateOrderPayload): Promise<Order> => {
    const res = await api.post<ApiResponse<Order>>('/orders', payload);
    return res.data.data;
  },

  getById: async (id: string): Promise<Order> => {
    const res = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return res.data.data;
  },

  updateStatus: async (id: string, status: string, estimatedTime?: number): Promise<Order> => {
    const res = await api.patch<ApiResponse<Order>>(`/orders/${id}/status`, {
      status,
      estimatedTime,
    });
    return res.data.data;
  },
};
