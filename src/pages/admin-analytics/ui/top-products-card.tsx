import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnalyticsReport } from '@/entities/analytics';
import { SegmentedControl } from '@/shared/ui/segmented-control';
import { formatMoneyShort, toChartNumber } from '../model/analytics-format';
import { AnalyticsCard } from './analytics-card';
import { RankedBarChart } from './ranked-bar-chart';

type ProductSort = 'revenue' | 'quantity';

interface TopProductsCardProps {
  report: AnalyticsReport;
}

export function TopProductsCard({ report }: TopProductsCardProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [sort, setSort] = useState<ProductSort>('revenue');
  const products = sort === 'revenue' ? report.topProductsByRevenue : report.topProductsByQuantity;
  const rows = products.map((product) => ({
    id: product.productId,
    label: product.name,
    value: sort === 'revenue' ? toChartNumber(product.revenue) : product.quantity,
    valueLabel:
      sort === 'revenue'
        ? formatMoneyShort({ value: product.revenue, language: i18n.language })
        : t('admin.analytics.products.pieces', { count: product.quantity }),
  }));
  return (
    <AnalyticsCard
      title={t('admin.analytics.products.title')}
      description={t('admin.analytics.products.description')}
      action={
        <SegmentedControl
          value={sort}
          onChange={setSort}
          ariaLabel={t('admin.analytics.products.sortLabel')}
          options={[
            { value: 'revenue', label: t('admin.analytics.products.byRevenue') },
            { value: 'quantity', label: t('admin.analytics.products.byQuantity') },
          ]}
        />
      }
    >
      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">{t('admin.analytics.noData')}</p>
      ) : (
        <RankedBarChart
          rows={rows}
          color="var(--primary)"
          onRowClick={(id) => void navigate({ to: '/admin/products', search: { edit: id } })}
        />
      )}
    </AnalyticsCard>
  );
}
