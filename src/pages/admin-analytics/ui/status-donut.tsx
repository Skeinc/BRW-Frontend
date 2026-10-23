import { Pie, PieChart } from 'recharts';
import { useTranslation } from 'react-i18next';
import type { AnalyticsCount } from '@/entities/analytics';
import type { OrderStatus } from '@/entities/order';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/shared/ui/chart';
import { formatShare } from '../model/analytics-format';
import { ChartTooltipRow } from './chart-tooltip-row';

const STATUS_COLORS: Readonly<Record<OrderStatus, string>> = {
  new: 'var(--chart-2)',
  in_progress: 'var(--chart-1)',
  done: 'var(--chart-3)',
  cancelled: 'var(--chart-4)',
};

interface StatusDonutProps {
  statuses: AnalyticsCount<OrderStatus>[];
}

export function StatusDonut({ statuses }: StatusDonutProps) {
  const { t } = useTranslation();
  const total = statuses.reduce((sum, status) => sum + status.count, 0);
  const data = statuses.map((status) => ({
    status: status.key,
    count: status.count,
    fill: STATUS_COLORS[status.key],
  }));
  const config = Object.fromEntries(
    statuses.map((status) => [
      status.key,
      { label: t(`admin.orders.statuses.${status.key}`), color: STATUS_COLORS[status.key] },
    ]),
  ) satisfies ChartConfig;
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="relative size-44 shrink-0">
        <ChartContainer config={config} className="aspect-square size-full">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, _name, item) => (
                    <ChartTooltipRow
                      color={String(item.payload.fill)}
                      label={t(`admin.orders.statuses.${String(item.payload.status)}`)}
                      value={`${value} · ${formatShare({ part: Number(value), total })}`}
                    />
                  )}
                />
              }
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius={54}
              outerRadius={82}
              paddingAngle={2}
              stroke="var(--card)"
              strokeWidth={2}
            />
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold tabular-nums">{total}</span>
          <span className="text-xs text-muted-foreground">{t('admin.analytics.statuses.total')}</span>
        </div>
      </div>
      <ul className="flex min-w-40 flex-1 flex-col gap-2 text-sm">
        {statuses.map((status) => (
          <li key={status.key} className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-[2px]"
              style={{ backgroundColor: STATUS_COLORS[status.key] }}
              aria-hidden
            />
            <span>{t(`admin.orders.statuses.${status.key}`)}</span>
            <span className="ml-auto font-semibold tabular-nums">{status.count}</span>
            <span className="w-10 text-right text-muted-foreground tabular-nums">
              {formatShare({ part: status.count, total })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
