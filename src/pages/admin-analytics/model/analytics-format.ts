import { SITE_CURRENCY } from '@/shared/config';
import { toLocaleTag } from '@/shared/lib/to-locale-tag';

/** Money string to a number for a chart. Display only, never arithmetic on money. */
export function toChartNumber(value: string): number {
  return Number(value);
}

/** Change from `previous` to `current` in percent, or null when there is nothing to compare with. */
export function getChangePercent({ current, previous }: { current: number; previous: number }): number | null {
  return previous === 0 ? null : (current / previous - 1) * 100;
}

/** `25 тыс.` style short number for an axis. */
export function formatCompact({ value, language }: { value: number; language: string }): string {
  return new Intl.NumberFormat(toLocaleTag(language), { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

/** `3 окт` for an API date `YYYY-MM-DD`. */
export function formatDay({ date, language }: { date: string; language: string }): string {
  const [year, month, day] = date.split('-').map(Number);
  return new Intl.DateTimeFormat(toLocaleTag(language), { day: 'numeric', month: 'short' }).format(
    new Date(year, month - 1, day),
  );
}

/** Share of `part` in `total` as a whole percent. */
export function formatShare({ part, total }: { part: number; total: number }): string {
  return `${total === 0 ? 0 : Math.round((part / total) * 100)}%`;
}

/** `15 126 BYN` for a money string, without kopecks: for labels on a chart. Display only. */
export function formatMoneyShort({ value, language }: { value: string; language: string }): string {
  const formatter = new Intl.NumberFormat(toLocaleTag(language), { maximumFractionDigits: 0 });
  return `${formatter.format(Number(value))} ${SITE_CURRENCY}`;
}
