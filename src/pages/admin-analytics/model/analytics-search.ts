import { z } from 'zod';
import { ANALYTICS_PERIODS, DEFAULT_ANALYTICS_PERIOD, type AnalyticsPeriod } from '@/entities/analytics';

export const analyticsSearchSchema = z.object({
  period: z.enum(ANALYTICS_PERIODS).optional().catch(undefined),
});

export type AnalyticsSearch = z.infer<typeof analyticsSearchSchema>;

export function toAnalyticsPeriod(search: AnalyticsSearch): AnalyticsPeriod {
  return search.period ?? DEFAULT_ANALYTICS_PERIOD;
}
