import apiClient from './client';
import type { Category, CategoryCreateRequest, Product, PaginatedResponse } from '@/types';

export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },

  getCategoryProducts: async (id: string, params?: { page?: number; size?: number }): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>(`/categories/${id}/products`, { params });
    return response.data;
  },

  // Admin endpoints
  createCategory: async (data: CategoryCreateRequest): Promise<Category> => {
    const response = await apiClient.post<Category>('/admin/categories', data);
    return response.data;
  },

  updateCategory: async (id: string, data: CategoryCreateRequest): Promise<Category> => {
    const response = await apiClient.put<Category>(`/admin/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/categories/${id}`);
  },
};
