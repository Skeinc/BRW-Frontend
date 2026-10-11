import { DEFAULT_LANGUAGE, isLanguage, type Language } from './languages';

interface HeadMatch {
  routeId: string;
  loaderData?: unknown;
}

const ROOT_ROUTE_ID = '__root__';

/** Reads the visitor language from the root loader data, for use inside a route `head()`. */
export function readHeadLanguage(matches: readonly HeadMatch[]): Language {
  const data = matches.find((match) => match.routeId === ROOT_ROUTE_ID)?.loaderData;
  const language = typeof data === 'object' && data !== null && 'language' in data ? data.language : undefined;
  return isLanguage(language) ? language : DEFAULT_LANGUAGE;
}
