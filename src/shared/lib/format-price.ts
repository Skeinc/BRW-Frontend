import { SITE_CURRENCY } from '@/shared/config';

const LOCALE_TAGS: Record<string, string> = { ru: 'ru-RU', en: 'en-US' };

/** Formats an API money string (`"1299.00"`) for display, e.g. `1 299,00 BYN`. Display only, never arithmetic. */
export function formatPrice(value: string, locale: string = 'ru'): string {
  const formatter = new Intl.NumberFormat(LOCALE_TAGS[locale] ?? locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formatter.format(Number(value))} ${SITE_CURRENCY}`;
}
