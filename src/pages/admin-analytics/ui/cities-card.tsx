import { useTranslation } from 'react-i18next';
import type { AnalyticsCityRow } from '@/entities/analytics';
import { AnalyticsCard } from './analytics-card';
import { RankedBarChart } from './ranked-bar-chart';

const NARROW_LABEL_WIDTH = 88;

interface CitiesCardProps {
  cities: AnalyticsCityRow[];
}

export function CitiesCard({ cities }: CitiesCardProps) {
  const { t } = useTranslation();
  const rows = cities.map((city) => ({
    id: city.city,
    label: city.city,
    value: city.orders,
    valueLabel: t('admin.analytics.cities.orders', { count: city.orders }),
  }));
  return (
    <AnalyticsCard title={t('admin.analytics.cities.title')} description={t('admin.analytics.cities.description')}>
      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">{t('admin.analytics.noData')}</p>
      ) : (
        <RankedBarChart rows={rows} color="var(--chart-1)" labelWidth={NARROW_LABEL_WIDTH} />
      )}
    </AnalyticsCard>
  );
}
