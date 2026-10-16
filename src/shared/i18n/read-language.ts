import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequestHeader } from '@tanstack/react-start/server';
import { DEFAULT_LANGUAGE, isLanguage, LANGUAGE_COOKIE, type Language } from './languages';

function parseLanguageCookie(cookieHeader: string | undefined): Language {
  const prefix = `${LANGUAGE_COOKIE}=`;
  const entry = cookieHeader
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  let value = entry?.slice(prefix.length);
  try {
    value = value === undefined ? undefined : decodeURIComponent(value);
  } catch {
    value = undefined;
  }
  return isLanguage(value) ? value : DEFAULT_LANGUAGE;
}

/** Language chosen by the visitor: from the request cookie on the server, from `document.cookie` in the browser. */
export const readLanguage = createIsomorphicFn()
  .server((): Language => parseLanguageCookie(getRequestHeader('cookie')))
  .client((): Language => parseLanguageCookie(document.cookie));
