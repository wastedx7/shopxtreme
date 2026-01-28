import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/api/orders';
import { useAuth } from '@/context/AuthContext';

export function useCustomerOrders() {
  const { user, isAuthenticated, isCustomer } = useAuth();

  return useQuery({
    queryKey: ['orders', 'customer', user?.id],
    queryFn: () => ordersApi.getCustomerOrders(user!.id),
    enabled: isAuthenticated && isCustomer && !!user?.id,
    staleTime: 1000 * 60 * 2,
  });
}

export function useSellerOrders() {
  const { user, isAuthenticated, isSeller } = useAuth();

  return useQuery({
    queryKey: ['orders', 'seller', user?.id],
    queryFn: () => ordersApi.getSellerOrders(user!.id),
    enabled: isAuthenticated && isSeller && !!user?.id,
    staleTime: 1000 * 60 * 2,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getOrder(id),
    enabled: !!id,
    staleTime: 1000 * 60,
  });
}
