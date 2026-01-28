import apiClient from './client';
import type { Cart, AddToCartRequest, UpdateCartItemRequest, Order } from '@/types';

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<Cart>('/cart');
    return response.data;
  },

  addItem: async (data: AddToCartRequest): Promise<Cart> => {
    const response = await apiClient.post<Cart>('/cart/items', data);
    return response.data;
  },

  updateItem: async (itemId: string, data: UpdateCartItemRequest): Promise<Cart> => {
    const response = await apiClient.put<Cart>(`/cart/items/${itemId}`, data);
    return response.data;
  },

  removeItem: async (itemId: string): Promise<Cart> => {
    const response = await apiClient.delete<Cart>(`/cart/items/${itemId}`);
    return response.data;
  },

  checkout: async (): Promise<Order> => {
    const response = await apiClient.post<Order>('/cart/checkout');
    return response.data;
  },
};
