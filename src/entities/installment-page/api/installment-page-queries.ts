import { queryOptions } from '@tanstack/react-query';
import { fetchAdminInstallmentPage, fetchInstallmentPage } from './installment-page-api';

export const installmentPageQueryKey = ['catalog', 'installment-page'] as const;

export const adminInstallmentPageQueryKey = ['admin', 'installment-page'] as const;

export const installmentPageQueryOptions = queryOptions({
  queryKey: installmentPageQueryKey,
  queryFn: fetchInstallmentPage,
});

export const adminInstallmentPageQueryOptions = queryOptions({
  queryKey: adminInstallmentPageQueryKey,
  queryFn: fetchAdminInstallmentPage,
});
