import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ChartColumn, TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { analyticsReportQueryOptions, type AnalyticsPeriod } from '@/entities/analytics';
import { getApiErrorMessage } from '@/shared/api';
import { getBrowserTimeZone } from '@/shared/lib/browser-time-zone';
import { cn } from '@/shared/lib/utils';
import { DataTableEmptyState } from '@/shared/ui/data-table-empty-state';
import { toAnalyticsPeriod, type AnalyticsSearch } from '../model/analytics-search';
import { AnalyticsContent } from './analytics-content';
import { AnalyticsSkeleton } from './analytics-skeleton';
import { AnalyticsToolbar } from './analytics-toolbar';
import { CatalogHealth } from './catalog-health';

interface AdminAnalyticsPageProps {
  search: AnalyticsSearch;
  onSearchChange: (patch: Partial<AnalyticsSearch>) => void;
}

export function AdminAnalyticsPage({ search, onSearchChange }: AdminAnalyticsPageProps) {
  const { t } = useTranslation();
  const period = toAnalyticsPeriod(search);
  const query = useQuery({
    ...analyticsReportQueryOptions({ period, timeZone: getBrowserTimeZone() }),
    placeholderData: keepPreviousData,
  });
  const report = query.data;
  const isRefreshing = query.isFetching && !query.isPending;
  const changePeriod = (next: AnalyticsPeriod) => onSearchChange({ period: next });

  return (
    <div className="flex flex-col gap-4">
      <AnalyticsToolbar period={period} report={report} onPeriodChange={changePeriod} />
      {query.isPending ? <AnalyticsSkeleton /> : null}
      {query.error && !report ? (
        <DataTableEmptyState icon={TriangleAlert} title={getApiErrorMessage(query.error, t)} />
      ) : null}
      {query.isError && report ? (
        <p role="alert" className="text-sm text-destructive">
          {getApiErrorMessage(query.error, t)}
        </p>
      ) : null}
      {report ? (
        <div className={cn('flex flex-col gap-4 transition-opacity', isRefreshing && 'opacity-60')}>
          {report.current.orders === 0 ? (
            <DataTableEmptyState
              icon={ChartColumn}
              title={t('admin.analytics.empty.title')}
              description={t('admin.analytics.empty.description')}
            />
          ) : (
            <AnalyticsContent report={report} />
          )}
          <CatalogHealth health={report.catalogHealth} />
        </div>
      ) : null}
    </div>
  );
}
