import { queryOptions } from '@tanstack/react-query';
import { fetchAdminMe } from './admin-session-api';

export const adminMeQueryKey = ['admin', 'me'] as const;

export const adminMeQueryOptions = queryOptions({
  queryKey: adminMeQueryKey,
  queryFn: fetchAdminMe,
  retry: false,
  staleTime: 60_000,
});
