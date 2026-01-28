import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/products';
import { categoriesApi } from '@/api/categories';
import type { ProductsParams } from '@/types';

export function useProducts(params?: ProductsParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProduct(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getCategories,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useCategoryProducts(categoryId: string, params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: ['category-products', categoryId, params],
    queryFn: () => categoriesApi.getCategoryProducts(categoryId, params),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5,
  });
}
