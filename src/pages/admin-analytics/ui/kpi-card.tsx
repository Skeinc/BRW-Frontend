import { TrendingDown, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

interface KpiCardProps {
  label: string;
  value: string;
  hint: string;
  /** Change to the previous period in percent, or null when there is nothing to compare with. */
  changePercent: number | null;
  /** Whether a growth is good news; false for a share of cancelled orders. */
  isGrowthGood: boolean;
}

export function KpiCard({ label, value, hint, changePercent, isGrowthGood }: KpiCardProps) {
  const { t, i18n } = useTranslation();
  const isGood = changePercent === null || changePercent >= 0 === isGrowthGood;
  const Icon = changePercent !== null && changePercent < 0 ? TrendingDown : TrendingUp;
  const formatter = new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 1, signDisplay: 'exceptZero' });
  return (
    <Card className="gap-1 px-5 py-5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {changePercent === null ? null : (
          <Badge
            variant="outline"
            className={cn('tabular-nums', isGood ? 'text-emerald-700 dark:text-emerald-400' : 'text-destructive')}
            title={t('admin.analytics.kpi.vsPrevious')}
          >
            <Icon aria-hidden />
            {formatter.format(changePercent)}%
          </Badge>
        )}
      </div>
      <div className="text-2xl font-extrabold tracking-tight tabular-nums">{value}</div>
      <div className="text-sm text-muted-foreground">{hint}</div>
    </Card>
  );
}
