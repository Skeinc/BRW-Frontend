import { SITE_CURRENCY } from '@/shared/config';
import { toLocaleTag } from './to-locale-tag';

/** Formats an API money string (`"1299.00"`) for display, e.g. `1 299,00 BYN`. Display only, never arithmetic. */
export function formatPrice(value: string, locale: string = 'ru'): string {
  const formatter = new Intl.NumberFormat(toLocaleTag(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formatter.format(Number(value))} ${SITE_CURRENCY}`;
}
