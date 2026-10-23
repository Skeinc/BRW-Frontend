import { useTranslation } from 'react-i18next';
import { ANALYTICS_PERIODS, type AnalyticsPeriod, type AnalyticsReport } from '@/entities/analytics';
import { SegmentedControl } from '@/shared/ui/segmented-control';
import { formatDay } from '../model/analytics-format';

interface AnalyticsToolbarProps {
  period: AnalyticsPeriod;
  /** The loaded report; its dates are shown next to the switch. */
  report: AnalyticsReport | undefined;
  onPeriodChange: (period: AnalyticsPeriod) => void;
}

export function AnalyticsToolbar({ period, report, onPeriodChange }: AnalyticsToolbarProps) {
  const { t, i18n } = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <SegmentedControl
        value={period}
        onChange={onPeriodChange}
        ariaLabel={t('admin.analytics.period.label')}
        className="w-full sm:w-auto"
        listClassName="w-full sm:w-fit"
        options={ANALYTICS_PERIODS.map((value) => ({ value, label: t(`admin.analytics.period.${value}`) }))}
      />
      {report ? (
        <span className="text-sm text-muted-foreground">
          {t('admin.analytics.range', {
            from: formatDay({ date: report.from, language: i18n.language }),
            to: formatDay({ date: report.to, language: i18n.language }),
          })}
          {' · '}
          {t('admin.analytics.comparedWith')}
        </span>
      ) : null}
    </div>
  );
}
