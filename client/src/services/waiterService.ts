import api from './api';
import type { ApiResponse, WaiterRequest, WaiterRequestType } from '@/types';

export const waiterService = {
  call: async (tableNumber: number, requestType: WaiterRequestType): Promise<WaiterRequest> => {
    const res = await api.post<ApiResponse<WaiterRequest>>('/waiter-request', {
      tableNumber,
      requestType,
    });
    return res.data.data;
  },
};
