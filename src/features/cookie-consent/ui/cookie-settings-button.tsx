import { useTranslation } from 'react-i18next';
import { getRuntimeConfig } from '@/shared/config';
import { setCookieConsent, useCookieConsent } from '@/shared/lib/analytics/cookie-consent';

/** Footer link that reopens the consent banner; shown only when analytics are configured and a choice was made. */
export function CookieSettingsButton() {
  const { t } = useTranslation();
  const consent = useCookieConsent();
  const { metrikaId, gaId } = getRuntimeConfig();
  if (consent === undefined || consent === null || !(metrikaId || gaId)) {
    return null;
  }
  return (
    <button type="button" className="hover:text-background" onClick={() => setCookieConsent(null)}>
      {t('cookies.settings')}
    </button>
  );
}
