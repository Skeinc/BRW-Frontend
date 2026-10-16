const LOCALE_TAGS: Record<string, string> = { ru: 'ru-RU', en: 'en-US', be: 'be-BY' };

/** BCP 47 tag for an app language (`ru`, `en`, `be`), for `Intl` formatters. */
export function toLocaleTag(language: string): string {
  return LOCALE_TAGS[language] ?? language;
}
