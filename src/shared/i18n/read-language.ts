import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequestHeader } from '@tanstack/react-start/server';
import { DEFAULT_LANGUAGE, isLanguage, LANGUAGE_COOKIE, type Language } from './languages';

function parseLanguageCookie(cookieHeader: string | undefined): Language {
  const entry = cookieHeader?.split(';').find((part) => part.trim().startsWith(`${LANGUAGE_COOKIE}=`));
  const value = entry?.split('=')[1]?.trim();
  return isLanguage(value) ? value : DEFAULT_LANGUAGE;
}

/** Language chosen by the visitor: from the request cookie on the server, from `document.cookie` in the browser. */
export const readLanguage = createIsomorphicFn()
  .server((): Language => parseLanguageCookie(getRequestHeader('cookie')))
  .client((): Language => parseLanguageCookie(document.cookie));
