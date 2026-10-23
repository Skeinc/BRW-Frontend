import { useTranslation } from 'react-i18next';
import type { AnalyticsReport } from '@/entities/analytics';
import { formatPrice } from '@/shared/lib/format-price';
import { getChangePercent, toChartNumber } from '../model/analytics-format';
import { KpiCard } from './kpi-card';

interface KpiCardsProps {
  report: AnalyticsReport;
}

export function KpiCards({ report }: KpiCardsProps) {
  const { t, i18n } = useTranslation();
  const { current, previous } = report;
  const currentCancelledShare = current.orders === 0 ? 0 : (current.cancelledOrders / current.orders) * 100;
  const previousCancelledShare = previous.orders === 0 ? 0 : (previous.cancelledOrders / previous.orders) * 100;
  const percentFormatter = new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 1 });
  return (
    <section aria-label={t('admin.analytics.title')} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label={t('admin.analytics.kpi.revenue')}
        value={formatPrice(current.revenue, i18n.language)}
        hint={t('admin.analytics.kpi.revenueHint')}
        changePercent={getChangePercent({
          current: toChartNumber(current.revenue),
          previous: toChartNumber(previous.revenue),
        })}
        isGrowthGood
      />
      <KpiCard
        label={t('admin.analytics.kpi.orders')}
        value={String(current.orders)}
        hint={t('admin.analytics.kpi.ordersHint')}
        changePercent={getChangePercent({ current: current.orders, previous: previous.orders })}
        isGrowthGood
      />
      <KpiCard
        label={t('admin.analytics.kpi.averageCheck')}
        value={formatPrice(current.averageCheck, i18n.language)}
        hint={t('admin.analytics.kpi.averageCheckHint')}
        changePercent={getChangePercent({
          current: toChartNumber(current.averageCheck),
          previous: toChartNumber(previous.averageCheck),
        })}
        isGrowthGood
      />
      <KpiCard
        label={t('admin.analytics.kpi.cancelled')}
        value={`${percentFormatter.format(currentCancelledShare)}%`}
        hint={t('admin.analytics.kpi.cancelledHint')}
        changePercent={getChangePercent({ current: currentCancelledShare, previous: previousCancelledShare })}
        isGrowthGood={false}
      />
    </section>
  );
}
