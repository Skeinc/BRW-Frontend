export interface RuntimeConfig {
  publicApiUrl: string;
  siteUrl: string;
  /** Yandex Metrika counter id; analytics stay off while it is empty. */
  metrikaId?: string;
  /** GA4 measurement id such as `G-XXXXXXXXXX`; analytics stay off while it is empty. */
  gaId?: string;
}

declare global {
  interface Window {
    BRW_CONFIG?: RuntimeConfig;
  }
}

const DEFAULT_API_URL = 'http://localhost:3000';
const DEFAULT_SITE_URL = 'http://localhost:8080';

/** Reads server env. Call on the server only. */
export function readServerRuntimeConfig(): RuntimeConfig {
  return {
    publicApiUrl: process.env.PUBLIC_API_URL ?? DEFAULT_API_URL,
    siteUrl: process.env.PUBLIC_SITE_URL ?? DEFAULT_SITE_URL,
    metrikaId: process.env.PUBLIC_METRIKA_ID || undefined,
    gaId: process.env.PUBLIC_GA4_ID || undefined,
  };
}

/** Runtime config injected by the SSR shell, so one image works in any environment. */
export function getRuntimeConfig(): RuntimeConfig {
  if (typeof window === 'undefined') {
    return readServerRuntimeConfig();
  }
  if (window.BRW_CONFIG) {
    return window.BRW_CONFIG;
  }
  if (import.meta.env.DEV) {
    return { publicApiUrl: DEFAULT_API_URL, siteUrl: window.location.origin };
  }
  throw new Error('window.BRW_CONFIG is missing: the runtime config script did not run');
}

/** API base including the `/api` prefix: API_INTERNAL_URL on the server, PUBLIC_API_URL in the browser. */
export function getApiBaseUrl(): string {
  const origin =
    typeof window === 'undefined'
      ? (process.env.API_INTERNAL_URL ?? process.env.PUBLIC_API_URL ?? DEFAULT_API_URL)
      : getRuntimeConfig().publicApiUrl;
  return `${origin.replace(/\/$/, '')}/api`;
}
