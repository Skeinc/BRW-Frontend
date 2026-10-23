import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnalyticsReport } from '@/entities/analytics';
import { SegmentedControl } from '@/shared/ui/segmented-control';
import { ActivityHeatmap } from './activity-heatmap';
import { AnalyticsCard } from './analytics-card';
import { CategoriesCard } from './categories-card';
import { CitiesCard } from './cities-card';
import { CollectionsCard } from './collections-card';
import { KpiCards } from './kpi-cards';
import { SplitCard } from './split-card';
import { StatusDonut } from './status-donut';
import { TopProductsCard } from './top-products-card';
import { TrendChart, type TrendMetric } from './trend-chart';

interface AnalyticsContentProps {
  report: AnalyticsReport;
}

/** Every block of the report for a period that has orders. */
export function AnalyticsContent({ report }: AnalyticsContentProps) {
  const { t } = useTranslation();
  const [metric, setMetric] = useState<TrendMetric>('revenue');
  return (
    <>
      <KpiCards report={report} />
      <AnalyticsCard
        title={t(`admin.analytics.trend.${metric}Title`)}
        description={t(`admin.analytics.trend.${metric}Hint`)}
        action={
          <SegmentedControl
            value={metric}
            onChange={setMetric}
            ariaLabel={t('admin.analytics.trend.metricLabel')}
            options={[
              { value: 'revenue', label: t('admin.analytics.trend.revenue') },
              { value: 'orders', label: t('admin.analytics.trend.orders') },
            ]}
          />
        }
      >
        <TrendChart daily={report.daily} metric={metric} />
      </AnalyticsCard>
      <div className="grid gap-4 xl:grid-cols-2">
        <AnalyticsCard
          title={t('admin.analytics.statuses.title')}
          description={t('admin.analytics.statuses.description')}
        >
          <StatusDonut statuses={report.statuses} />
        </AnalyticsCard>
        <AnalyticsCard
          title={t('admin.analytics.activity.title')}
          description={t('admin.analytics.activity.description')}
        >
          <ActivityHeatmap activity={report.activity} />
        </AnalyticsCard>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <TopProductsCard report={report} />
        <CategoriesCard categories={report.categories} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <CollectionsCard collections={report.collections} />
        <SplitCard report={report} />
        <CitiesCard cities={report.cities} />
      </div>
    </>
  );
}
