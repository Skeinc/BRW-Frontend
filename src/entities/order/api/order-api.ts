import { apiRequest, toQueryString, type Paginated } from '@/shared/api';
import type {
  CreateOrderInput,
  CreateOrderResult,
  Order,
  OrderListItem,
  OrderListParams,
  OrderStatus,
} from '../model/types';

export function fetchOrdersPage(params: OrderListParams): Promise<Paginated<OrderListItem>> {
  return apiRequest<Paginated<OrderListItem>>(`/admin/orders${toQueryString({ ...params })}`);
}

export function fetchOrder(id: string): Promise<Order> {
  return apiRequest<Order>(`/admin/orders/${id}`);
}

export function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  return apiRequest<Order>(`/admin/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

/** Storefront request: the server recounts prices and stock, so only product ids and quantities are sent. */
export function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  return apiRequest<CreateOrderResult>('/orders', { method: 'POST', body: JSON.stringify(input) });
}
