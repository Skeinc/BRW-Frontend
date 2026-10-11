import { LANGUAGE_COOKIE, type Language } from './languages';

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/** Persists the visitor language in a cookie so the server can render the next request in it. Browser only. */
export function saveLanguage(language: Language): void {
  document.cookie = `${LANGUAGE_COOKIE}=${language}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}
