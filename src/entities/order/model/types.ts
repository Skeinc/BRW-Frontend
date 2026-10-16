export type OrderStatus = 'new' | 'in_progress' | 'done' | 'cancelled';

export const ORDER_STATUSES: readonly OrderStatus[] = ['new', 'in_progress', 'done', 'cancelled'];

/** Statuses an order can move to from each status; the API refuses any other change. */
export const ORDER_STATUS_TRANSITIONS: Readonly<Record<OrderStatus, readonly OrderStatus[]>> = {
  new: ['in_progress', 'cancelled'],
  in_progress: ['done', 'cancelled'],
  done: ['in_progress'],
  cancelled: ['new'],
};

export type DeliveryMethod = 'delivery' | 'pickup';

export type PaymentMethod = 'cash_on_delivery' | 'installment' | 'bank_transfer';

/** One row of the order list. `total` is a money string such as `"1299.00"`. */
export interface OrderListItem {
  id: string;
  number: string;
  status: OrderStatus;
  contactName: string;
  phone: string;
  email: string | null;
  deliveryMethod: DeliveryMethod;
  city: string | null;
  address: string | null;
  paymentMethod: PaymentMethod;
  comment: string | null;
  total: string;
  createdAt: string;
  updatedAt: string;
  itemsCount: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  sku: string | null;
  unitPrice: string;
  quantity: number;
}

export interface Order extends Omit<OrderListItem, 'itemsCount'> {
  items: OrderItem[];
}

export interface OrderListParams {
  page: number;
  pageSize: number;
  status?: OrderStatus;
  q?: string;
}
