import apiClient from './client';
import type { User, LoginRequest, CustomerRegisterRequest, SellerRegisterRequest } from '@/types';

export const authApi = {
  login: async (data: LoginRequest): Promise<User> => {
    const response = await apiClient.post<User>('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data;
  },

  registerCustomer: async (data: CustomerRegisterRequest): Promise<User> => {
    const response = await apiClient.post<User>('/auth/register/customer', data);
    return response.data;
  },

  registerSeller: async (data: SellerRegisterRequest): Promise<User> => {
    const response = await apiClient.post<User>('/auth/register/seller', data);
    return response.data;
  },
};
