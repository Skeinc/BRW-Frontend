import { toLocaleTag } from './to-locale-tag';

/** Formats an API timestamp (ISO string) as a short date and time, e.g. `16.10.2026, 14:05`. Display only. */
export function formatDateTime(value: string, language: string = 'ru'): string {
  return new Intl.DateTimeFormat(toLocaleTag(language), { dateStyle: 'short', timeStyle: 'short' }).format(
    new Date(value),
  );
}
