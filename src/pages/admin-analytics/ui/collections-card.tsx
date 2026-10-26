import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { AnalyticsCollectionRow } from '@/entities/analytics';
import { formatMoneyShort, toChartNumber } from '../model/analytics-format';
import { AnalyticsCard } from './analytics-card';
import { RankedBarChart } from './ranked-bar-chart';

const NARROW_LABEL_WIDTH = 88;

interface CollectionsCardProps {
  collections: AnalyticsCollectionRow[];
}

export function CollectionsCard({ collections }: CollectionsCardProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const rows = collections.map((collection) => ({
    id: collection.id,
    label: collection.name,
    value: toChartNumber(collection.revenue),
    valueLabel: formatMoneyShort({ value: collection.revenue, language: i18n.language }),
  }));
  return (
    <AnalyticsCard
      title={t('admin.analytics.collections.title')}
      description={t('admin.analytics.collections.description')}
    >
      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">{t('admin.analytics.noData')}</p>
      ) : (
        <RankedBarChart
          rows={rows}
          color="var(--primary)"
          labelWidth={NARROW_LABEL_WIDTH}
          onRowClick={(id) => void navigate({ to: '/admin/collections', search: { edit: id } })}
        />
      )}
    </AnalyticsCard>
  );
}
