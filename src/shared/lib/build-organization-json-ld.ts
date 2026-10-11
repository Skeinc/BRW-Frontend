import {
  getRuntimeConfig,
  SITE_INSTAGRAM_URL,
  SITE_LEGAL_NAME,
  SITE_NAME,
  SITE_PHONE,
  SITE_STORES,
} from '@/shared/config';
import { translate, type Language } from '@/shared/i18n';

/** schema.org `Organization` for the about page: legal name, stores, phones and Instagram. */
export function buildOrganizationJsonLd(language: Language): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    legalName: SITE_LEGAL_NAME,
    url: getRuntimeConfig().siteUrl.replace(/\/$/, ''),
    telephone: SITE_PHONE,
    sameAs: [SITE_INSTAGRAM_URL],
    location: SITE_STORES.map((store) => ({
      '@type': 'Place',
      name: translate(language, `stores.${store.id}.address`),
      telephone: store.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: translate(language, `stores.${store.id}.street`),
        addressLocality: translate(language, 'stores.city'),
        addressCountry: 'BY',
      },
    })),
  };
}
