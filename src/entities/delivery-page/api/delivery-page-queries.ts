import { queryOptions } from '@tanstack/react-query';
import { fetchAdminDeliveryPage, fetchDeliveryPage } from './delivery-page-api';

export const deliveryPageQueryKey = ['catalog', 'delivery-page'] as const;

export const adminDeliveryPageQueryKey = ['admin', 'delivery-page'] as const;

export const deliveryPageQueryOptions = queryOptions({
  queryKey: deliveryPageQueryKey,
  queryFn: fetchDeliveryPage,
});

export const adminDeliveryPageQueryOptions = queryOptions({
  queryKey: adminDeliveryPageQueryKey,
  queryFn: fetchAdminDeliveryPage,
});
