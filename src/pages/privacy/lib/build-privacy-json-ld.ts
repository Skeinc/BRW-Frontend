import { translate, type Language } from '@/shared/i18n';
import { buildBreadcrumbJsonLd } from '@/shared/lib/build-breadcrumb-json-ld';

/** schema.org `BreadcrumbList` for the personal data agreement page. */
export function buildPrivacyJsonLd(language: Language): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [buildBreadcrumbJsonLd(language, translate(language, 'pages.privacy.heading'), '/privacy')],
  };
}
