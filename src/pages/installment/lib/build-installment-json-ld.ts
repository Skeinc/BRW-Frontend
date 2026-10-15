import { translate, type Language } from '@/shared/i18n';
import { buildBreadcrumbJsonLd } from '@/shared/lib/build-breadcrumb-json-ld';

/** schema.org `BreadcrumbList` for the installment page. */
export function buildInstallmentJsonLd(language: Language): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [buildBreadcrumbJsonLd(language, translate(language, 'pages.installment.heading'), '/installment')],
  };
}
