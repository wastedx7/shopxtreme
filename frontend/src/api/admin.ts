import apiClient from './client';
import type { AdminUser, AdminStats, UpdateUserRolesRequest, Seller } from '@/types';

export const adminApi = {
  getUsers: async (): Promise<AdminUser[]> => {
    const response = await apiClient.get<AdminUser[]>('/admin/users');
    return response.data;
  },

  getStats: async (): Promise<AdminStats> => {
    const response = await apiClient.get<AdminStats>('/admin/stats');
    return response.data;
  },

  updateUserRoles: async (id: string, data: UpdateUserRolesRequest): Promise<AdminUser> => {
    const response = await apiClient.put<AdminUser>(`/admin/users/${id}/roles`, data);
    return response.data;
  },

  getPendingSellers: async (): Promise<Seller[]> => {
    const response = await apiClient.get<Seller[]>('/admin/sellers/pending');
    return response.data;
  },

  verifySeller: async (id: string): Promise<Seller> => {
    const response = await apiClient.put<Seller>(`/admin/sellers/${id}/verify`);
    return response.data;
  },
};
