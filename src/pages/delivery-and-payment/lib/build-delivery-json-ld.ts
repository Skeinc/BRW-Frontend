import { translate, type Language } from '@/shared/i18n';
import { buildBreadcrumbJsonLd } from '@/shared/lib/build-breadcrumb-json-ld';
import { FAQ_IDS } from '../model/faq-ids';

/** schema.org `FAQPage` and `BreadcrumbList` for the delivery and payment page. */
export function buildDeliveryJsonLd(language: Language): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildBreadcrumbJsonLd(language, translate(language, 'pages.deliveryAndPayment.heading'), '/delivery-and-payment'),
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_IDS.map((id) => ({
          '@type': 'Question',
          name: translate(language, `pages.deliveryAndPayment.faq.items.${id}.q`),
          acceptedAnswer: {
            '@type': 'Answer',
            text: translate(language, `pages.deliveryAndPayment.faq.items.${id}.a`),
          },
        })),
      },
    ],
  };
}
