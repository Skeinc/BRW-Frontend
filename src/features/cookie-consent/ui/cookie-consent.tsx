import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getRuntimeConfig } from '@/shared/config';
import { setCookieConsent, useCookieConsent } from '@/shared/lib/analytics/cookie-consent';
import { isAnalyticsLoaded, loadAnalytics } from '@/shared/lib/analytics/load-analytics';
import { Button } from '@/shared/ui/button';

/** Asks for cookie consent when analytics are configured, and loads Metrika and GA4 only after "Accept". */
export function CookieConsent() {
  const { t } = useTranslation();
  const consent = useCookieConsent();

  useEffect(() => {
    if (consent === 'granted') {
      loadAnalytics(getRuntimeConfig());
    } else if (consent === 'denied' && isAnalyticsLoaded()) {
      window.location.reload();
    }
  }, [consent]);

  const { metrikaId, gaId } = getRuntimeConfig();
  const isAnalyticsConfigured = Boolean(metrikaId || gaId);
  if (consent !== null || !isAnalyticsConfigured) {
    return null;
  }
  return (
    <section
      aria-label={t('cookies.title')}
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border bg-card p-4 shadow-lg sm:flex-row sm:items-center sm:p-5"
    >
      <div className="flex-1">
        <h2 className="font-semibold">{t('cookies.title')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('cookies.text')}</p>
      </div>
      <div className="flex flex-col gap-2 sm:shrink-0 sm:flex-row">
        <Button type="button" variant="outline" className="h-11" onClick={() => setCookieConsent('denied')}>
          {t('cookies.decline')}
        </Button>
        <Button type="button" className="h-11" onClick={() => setCookieConsent('granted')}>
          {t('cookies.accept')}
        </Button>
      </div>
    </section>
  );
}
