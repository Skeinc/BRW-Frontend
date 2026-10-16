import { apiRequest, toQueryString, type Paginated } from '@/shared/api';
import type { Order, OrderListItem, OrderListParams, OrderStatus } from '../model/types';

export function fetchOrdersPage(params: OrderListParams): Promise<Paginated<OrderListItem>> {
  return apiRequest<Paginated<OrderListItem>>(`/admin/orders${toQueryString({ ...params })}`);
}

export function fetchOrder(id: string): Promise<Order> {
  return apiRequest<Order>(`/admin/orders/${id}`);
}

export function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  return apiRequest<Order>(`/admin/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
}
