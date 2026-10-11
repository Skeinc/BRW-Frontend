import type { TOptions } from 'i18next';
import { getI18n } from './get-i18n';
import type { Language } from './languages';

/** Translates outside React, e.g. in route `head()`. */
export function translate(language: Language, key: string, options?: TOptions): string {
  return getI18n(language).t(key, options) as string;
}
