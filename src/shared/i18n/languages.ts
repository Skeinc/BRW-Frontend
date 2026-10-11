export const LANGUAGES = ['ru', 'en', 'be'] as const;

export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'ru';

export const LANGUAGE_COOKIE = 'brw-lang';

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.some((language) => language === value);
}
