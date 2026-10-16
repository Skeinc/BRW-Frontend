import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import type { OrderListParams, OrderStatus } from '../model/types';
import { fetchOrder, fetchOrdersPage, updateOrderStatus } from './order-api';

/** Prefix of every order query, to invalidate lists and cards together. */
export const ordersQueryKey = ['admin', 'orders'] as const;

export const ordersPageQueryOptions = (params: OrderListParams) =>
  queryOptions({
    queryKey: [...ordersQueryKey, 'page', params],
    queryFn: () => fetchOrdersPage(params),
  });

export const orderQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [...ordersQueryKey, 'detail', id],
    queryFn: () => fetchOrder(id),
  });

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => updateOrderStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ordersQueryKey }),
  });
}
