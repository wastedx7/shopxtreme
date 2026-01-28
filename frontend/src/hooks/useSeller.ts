import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sellersApi } from '@/api/sellers';
import { productsApi } from '@/api/products';
import { useAuth } from '@/context/AuthContext';
import type { ProductCreateRequest } from '@/types';

export function useSellerStats() {
  const { user, isAuthenticated, isSeller } = useAuth();

  return useQuery({
    queryKey: ['seller-stats', user?.id],
    queryFn: () => sellersApi.getSellerStats(user!.id),
    enabled: isAuthenticated && isSeller && !!user?.id,
    staleTime: 1000 * 60 * 2,
  });
}

export function useSellerProducts() {
  const { user, isAuthenticated, isSeller } = useAuth();

  return useQuery({
    queryKey: ['seller-products', user?.id],
    queryFn: () => sellersApi.getSellerProducts(user!.id),
    enabled: isAuthenticated && isSeller && !!user?.id,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductCreateRequest) => productsApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductCreateRequest }) =>
      productsApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
