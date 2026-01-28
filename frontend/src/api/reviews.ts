import apiClient from './client';
import type { Review, ReviewRequest } from '@/types';

export const reviewsApi = {
  getProductReviews: async (productId: string): Promise<Review[]> => {
    const response = await apiClient.get<Review[]>(`/products/${productId}/reviews`);
    return response.data;
  },

  createReview: async (productId: string, data: ReviewRequest): Promise<Review> => {
    const response = await apiClient.post<Review>(`/products/${productId}/reviews`, data);
    return response.data;
  },
};
