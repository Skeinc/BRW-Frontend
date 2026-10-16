import { z } from 'zod';
import { ORDER_STATUSES, type OrderListParams } from '@/entities/order';
import { DEFAULT_TABLE_PAGE_SIZE, tablePageSearchSchema } from '@/shared/lib/table-search';

export const ordersSearchSchema = tablePageSearchSchema.extend({
  q: z.string().optional().catch(undefined),
  status: z.enum(ORDER_STATUSES).optional().catch(undefined),
  /** The order open in the side panel. */
  orderId: z.uuid().optional().catch(undefined),
});

export type OrdersSearch = z.infer<typeof ordersSearchSchema>;

export function hasOrderFilters(search: OrdersSearch): boolean {
  return Boolean(search.q || search.status);
}

/** Query params of the API list for the URL search of the screen. */
export function toOrderListParams(search: OrdersSearch): OrderListParams {
  return {
    page: search.page ?? 1,
    pageSize: search.pageSize ?? DEFAULT_TABLE_PAGE_SIZE,
    q: search.q?.trim() || undefined,
    status: search.status,
  };
}
