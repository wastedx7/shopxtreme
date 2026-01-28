import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi } from '@/api/customers';
import { useAuth } from '@/context/AuthContext';

export function useWishlist() {
  const { user, isAuthenticated, isCustomer } = useAuth();

  return useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: () => customersApi.getWishlist(user!.id),
    enabled: isAuthenticated && isCustomer && !!user?.id,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (productId: string) => customersApi.addToWishlist(user!.id, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (productId: string) => customersApi.removeFromWishlist(user!.id, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}
