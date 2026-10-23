type OrderStatus = 'new' | 'in_progress' | 'done' | 'cancelled';

type PaymentMethod = 'cash_on_delivery' | 'installment' | 'bank_transfer';

type DeliveryMethod = 'delivery' | 'pickup';

export type AnalyticsPeriod = '7d' | '30d' | '90d' | '365d';

/** Query of the report. The days and hours of the charts are cut in `timeZone`, the zone of the viewer. */
export interface AnalyticsParams {
  period: AnalyticsPeriod;
  timeZone?: string;
}

export const ANALYTICS_PERIODS: readonly AnalyticsPeriod[] = ['7d', '30d', '90d', '365d'];

export const DEFAULT_ANALYTICS_PERIOD: AnalyticsPeriod = '30d';

/** Totals of one period. Money fields are strings such as `"1299.00"` and count only finished orders. */
export interface AnalyticsTotals {
  revenue: string;
  averageCheck: string;
  orders: number;
  cancelledOrders: number;
}

/** One day of the trend; `date` is `YYYY-MM-DD`. */
export interface AnalyticsDailyPoint {
  date: string;
  revenue: string;
  orders: number;
}

export interface AnalyticsCount<TKey extends string> {
  key: TKey;
  count: number;
}

/** Orders created on a weekday (1 is Monday, 7 is Sunday) in an hour of the day (0 to 23). */
export interface AnalyticsActivityCell {
  weekday: number;
  hour: number;
  orders: number;
}

export interface AnalyticsProductRow {
  productId: string;
  name: string;
  revenue: string;
  quantity: number;
}

/** A category with the revenue of its whole subtree, in tree order; `depth` is 1 for a root category. */
export interface AnalyticsCategoryRow {
  id: string;
  name: string;
  depth: number;
  revenue: string;
}

export interface AnalyticsCollectionRow {
  id: string;
  name: string;
  revenue: string;
}

export interface AnalyticsCityRow {
  city: string;
  orders: number;
}

export interface AnalyticsCatalogHealth {
  outOfStock: number;
  withoutPhoto: number;
  hidden: number;
  withoutCollection: number;
  notOrdered: number;
}

export interface AnalyticsReport {
  period: AnalyticsPeriod;
  /** The zone the report was cut in: the requested one, or the default when it was unknown. */
  timeZone: string;
  from: string;
  to: string;
  current: AnalyticsTotals;
  previous: AnalyticsTotals;
  daily: AnalyticsDailyPoint[];
  statuses: AnalyticsCount<OrderStatus>[];
  payments: AnalyticsCount<PaymentMethod>[];
  deliveries: AnalyticsCount<DeliveryMethod>[];
  activity: AnalyticsActivityCell[];
  topProductsByRevenue: AnalyticsProductRow[];
  topProductsByQuantity: AnalyticsProductRow[];
  categories: AnalyticsCategoryRow[];
  collections: AnalyticsCollectionRow[];
  cities: AnalyticsCityRow[];
  catalogHealth: AnalyticsCatalogHealth;
}
