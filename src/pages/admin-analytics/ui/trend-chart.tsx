import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useTranslation } from 'react-i18next';
import type { AnalyticsDailyPoint } from '@/entities/analytics';
import { formatPrice } from '@/shared/lib/format-price';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/shared/ui/chart';
import { formatCompact, formatDay, toChartNumber } from '../model/analytics-format';
import { ChartTooltipRow } from './chart-tooltip-row';

export type TrendMetric = 'revenue' | 'orders';

interface TrendChartProps {
  daily: AnalyticsDailyPoint[];
  metric: TrendMetric;
}

export function TrendChart({ daily, metric }: TrendChartProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const data = daily.map((point) => ({
    date: point.date,
    value: metric === 'revenue' ? toChartNumber(point.revenue) : point.orders,
  }));
  const config = {
    value: { label: t(`admin.analytics.trend.${metric}`), color: 'var(--primary)' },
  } satisfies ChartConfig;
  const gradientId = `trend-fill-${metric}`;
  return (
    <ChartContainer config={config} className="aspect-auto h-72 w-full">
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(date: string) => formatDay({ date, language })}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={44}
          allowDecimals={false}
          tickFormatter={(value: number) => formatCompact({ value, language })}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => formatDay({ date: String(payload[0]?.payload.date), language })}
              formatter={(value) => (
                <ChartTooltipRow
                  color="var(--color-value)"
                  label={t(`admin.analytics.trend.${metric}`)}
                  value={metric === 'revenue' ? formatPrice(String(value), language) : String(value)}
                />
              )}
            />
          }
        />
        <Area
          dataKey="value"
          type="monotone"
          stroke="var(--color-value)"
          strokeWidth={2}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ChartContainer>
  );
}
