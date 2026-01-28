import apiClient from './client';
import type { Order, UpdateOrderStatusRequest } from '@/types';

export const ordersApi = {
  getOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  },

  getCustomerOrders: async (customerId: string): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>(`/customers/${customerId}/orders`);
    return response.data;
  },

  getSellerOrders: async (sellerId: string): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>(`/sellers/${sellerId}/orders`);
    return response.data;
  },

  // Admin
  updateOrderStatus: async (id: string, data: UpdateOrderStatusRequest): Promise<Order> => {
    const response = await apiClient.post<Order>(`/admin/orders/${id}/status`, data);
    return response.data;
  },
};
