import { apiRequest, toQueryString } from '@/shared/api';
import type { AnalyticsParams, AnalyticsReport } from '../model/types';

export function fetchAnalyticsReport({ period, timeZone }: AnalyticsParams): Promise<AnalyticsReport> {
  return apiRequest<AnalyticsReport>(`/admin/analytics${toQueryString({ period, timeZone })}`);
}
