import apiClient from './client';
import type { Customer, Product } from '@/types';

export const customersApi = {
  getCustomer: async (id: string): Promise<Customer> => {
    const response = await apiClient.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  updateCustomer: async (id: string, data: Partial<Customer>): Promise<Customer> => {
    const response = await apiClient.put<Customer>(`/customers/${id}`, data);
    return response.data;
  },

  // Wishlist
  getWishlist: async (id: string): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`/customers/${id}/wishlist`);
    return response.data;
  },

  addToWishlist: async (customerId: string, productId: string): Promise<void> => {
    await apiClient.post(`/customers/${customerId}/wishlist/${productId}`);
  },

  removeFromWishlist: async (customerId: string, productId: string): Promise<void> => {
    await apiClient.delete(`/customers/${customerId}/wishlist/${productId}`);
  },
};
