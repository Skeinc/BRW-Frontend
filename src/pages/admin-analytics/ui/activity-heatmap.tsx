import { useTranslation } from 'react-i18next';
import type { AnalyticsActivityCell } from '@/entities/analytics';

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const WEEKDAYS = [1, 2, 3, 4, 5, 6, 7] as const;
const HOUR_LABEL_STEP = 3;
const MIN_SHARE = 25;
const LEGEND_STEPS = [0, 0.25, 0.5, 0.75, 1] as const;

/** Fill of a cell: grey for no orders, otherwise the brand color from light to full as the count grows. */
function getCellColor({ orders, max }: { orders: number; max: number }): string {
  if (orders === 0 || max === 0) {
    return 'var(--muted)';
  }
  const share = MIN_SHARE + (100 - MIN_SHARE) * (orders / max);
  return `color-mix(in oklab, var(--primary) ${share}%, var(--card))`;
}

interface ActivityHeatmapProps {
  activity: AnalyticsActivityCell[];
}

export function ActivityHeatmap({ activity }: ActivityHeatmapProps) {
  const { t } = useTranslation();
  const counts = new Map(activity.map((cell) => [`${cell.weekday}-${cell.hour}`, cell.orders]));
  const max = Math.max(0, ...activity.map((cell) => cell.orders));
  return (
    <div>
      <div
        className="grid gap-0.5 text-[11px] text-muted-foreground"
        style={{ gridTemplateColumns: '1.75rem repeat(24, minmax(0, 1fr))' }}
      >
        <span />
        {HOURS.map((hour) => (
          <span key={hour} className="text-center tabular-nums">
            {hour % HOUR_LABEL_STEP === 0 ? hour : ''}
          </span>
        ))}
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} className="contents">
            <span className="flex items-center">{t(`admin.analytics.activity.weekdays.${weekday}`)}</span>
            {HOURS.map((hour) => {
              const orders = counts.get(`${weekday}-${hour}`) ?? 0;
              const text = `${t('admin.analytics.activity.cell', { day: t(`admin.analytics.activity.weekdays.${weekday}`), hour })}: ${t('admin.analytics.activity.orders', { count: orders })}`;
              return (
                <span
                  key={hour}
                  role="img"
                  aria-label={text}
                  title={text}
                  className="aspect-square rounded-[3px]"
                  style={{ backgroundColor: getCellColor({ orders, max }) }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        {t('admin.analytics.activity.less')}
        {LEGEND_STEPS.map((step) => (
          <span
            key={step}
            className="h-2.5 w-4 rounded-[2px]"
            style={{ backgroundColor: getCellColor({ orders: step * 100, max: 100 }) }}
            aria-hidden
          />
        ))}
        {t('admin.analytics.activity.more')}
      </div>
    </div>
  );
}
