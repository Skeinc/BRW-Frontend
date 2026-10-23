import { getRuntimeConfig } from '@/shared/config';
import { getCookieConsent } from './cookie-consent';

export type AnalyticsEvent = 'add_to_cart' | 'order_submitted';

declare global {
  interface Window {
    ym?: (counterId: number, method: string, ...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

/** Sends an event to Metrika and GA4. Does nothing until their ids are set and cookies are accepted, and never throws. */
export function track(event: AnalyticsEvent, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined' || getCookieConsent() !== 'granted') {
    return;
  }
  try {
    const { metrikaId, gaId } = getRuntimeConfig();
    if (metrikaId) {
      window.ym?.(Number(metrikaId), 'reachGoal', event, params);
    }
    if (gaId) {
      window.gtag?.('event', event, params);
    }
  } catch {
    // Analytics must never break the page.
  }
}
