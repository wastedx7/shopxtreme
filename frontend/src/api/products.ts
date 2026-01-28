import apiClient from './client';
import type { Product, ProductCreateRequest, ProductsParams, PaginatedResponse } from '@/types';

export const productsApi = {
  getProducts: async (params?: ProductsParams): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  getSellerProducts: async (sellerId: string): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`/products/seller/${sellerId}`);
    return response.data;
  },

  createProduct: async (data: ProductCreateRequest): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  updateProduct: async (id: string, data: ProductCreateRequest): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};
