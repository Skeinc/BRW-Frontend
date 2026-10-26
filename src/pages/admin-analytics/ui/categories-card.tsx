import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnalyticsCategoryRow } from '@/entities/analytics';
import { SegmentedControl } from '@/shared/ui/segmented-control';
import { formatMoneyShort, toChartNumber } from '../model/analytics-format';
import { AnalyticsCard } from './analytics-card';
import { RankedBarChart } from './ranked-bar-chart';

type CategoryScope = 'roots' | 'all';

interface CategoriesCardProps {
  categories: AnalyticsCategoryRow[];
}

export function CategoriesCard({ categories }: CategoriesCardProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [scope, setScope] = useState<CategoryScope>('roots');
  const rows = categories
    .filter((category) => scope === 'all' || category.depth === 1)
    .map((category) => ({
      id: category.id,
      label: category.name,
      depth: category.depth,
      value: toChartNumber(category.revenue),
      valueLabel: formatMoneyShort({ value: category.revenue, language: i18n.language }),
    }));
  return (
    <AnalyticsCard
      title={t('admin.analytics.categories.title')}
      description={t('admin.analytics.categories.description')}
      action={
        <SegmentedControl
          value={scope}
          onChange={setScope}
          ariaLabel={t('admin.analytics.categories.scopeLabel')}
          options={[
            { value: 'roots', label: t('admin.analytics.categories.roots') },
            { value: 'all', label: t('admin.analytics.categories.all') },
          ]}
        />
      }
    >
      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">{t('admin.analytics.noData')}</p>
      ) : (
        <div className="max-h-[28rem] overflow-y-auto">
          <RankedBarChart
            rows={rows}
            color="var(--primary)"
            onRowClick={(id) => void navigate({ to: '/admin/categories', search: { edit: id } })}
          />
        </div>
      )}
    </AnalyticsCard>
  );
}
