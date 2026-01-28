import apiClient from './client';
import type { Seller, Product, Order, SellerStats } from '@/types';

export const sellersApi = {
  getSeller: async (id: string): Promise<Seller> => {
    const response = await apiClient.get<Seller>(`/sellers/${id}`);
    return response.data;
  },

  getSellerProducts: async (id: string): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`/sellers/${id}/products`);
    return response.data;
  },

  getSellerOrders: async (id: string): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>(`/sellers/${id}/orders`);
    return response.data;
  },

  getSellerStats: async (id: string): Promise<SellerStats> => {
    const response = await apiClient.get<SellerStats>(`/sellers/${id}/stats`);
    return response.data;
  },
};
