import { queryOptions } from '@tanstack/react-query';
import type { AnalyticsParams } from '../model/types';
import { fetchAnalyticsReport } from './analytics-api';

/** Prefix of every analytics query. */
export const analyticsQueryKey = ['admin', 'analytics'] as const;

export const analyticsReportQueryOptions = (params: AnalyticsParams) =>
  queryOptions({
    queryKey: [...analyticsQueryKey, params],
    queryFn: () => fetchAnalyticsReport(params),
  });
