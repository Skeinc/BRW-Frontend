import { useTranslation } from 'react-i18next';
import type { AnalyticsReport } from '@/entities/analytics';
import { AnalyticsCard } from './analytics-card';
import { ShareBar } from './share-bar';

const SHARE_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)'] as const;

interface SplitCardProps {
  report: AnalyticsReport;
}

export function SplitCard({ report }: SplitCardProps) {
  const { t } = useTranslation();
  const payments = report.payments.map((payment, index) => ({
    key: payment.key,
    label: t(`admin.orders.paymentMethods.${payment.key}`),
    count: payment.count,
    color: SHARE_COLORS[index],
  }));
  const deliveries = report.deliveries.map((delivery, index) => ({
    key: delivery.key,
    label: t(`admin.orders.deliveryMethods.${delivery.key}`),
    count: delivery.count,
    color: SHARE_COLORS[index],
  }));
  return (
    <AnalyticsCard title={t('admin.analytics.split.title')} description={t('admin.analytics.split.description')}>
      <div className="flex flex-col gap-6">
        <ShareBar title={t('admin.analytics.split.payment')} parts={payments} />
        <ShareBar title={t('admin.analytics.split.delivery')} parts={deliveries} />
      </div>
    </AnalyticsCard>
  );
}
