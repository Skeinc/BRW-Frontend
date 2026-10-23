import { toLocaleTag } from './to-locale-tag';

const STORE_TIME_ZONE = 'Europe/Minsk';

/** Formats an API timestamp (ISO string) as a long date, e.g. `16 октября 2026 г.`. Display only. */
export function formatDate(value: string, language: string = 'ru'): string {
  return new Intl.DateTimeFormat(toLocaleTag(language), { dateStyle: 'long', timeZone: STORE_TIME_ZONE }).format(
    new Date(value),
  );
}
