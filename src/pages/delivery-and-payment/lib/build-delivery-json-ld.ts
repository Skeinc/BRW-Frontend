import { getRuntimeConfig } from '@/shared/config';
import { translate, type Language } from '@/shared/i18n';
import { FAQ_IDS } from '../model/faq-ids';

const PAGE_PATH = '/delivery-and-payment';

/** schema.org `FAQPage` and `BreadcrumbList` for the delivery and payment page. */
export function buildDeliveryJsonLd(language: Language): Record<string, unknown> {
  const siteUrl = getRuntimeConfig().siteUrl.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: translate(language, 'nav.home'), item: `${siteUrl}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: translate(language, 'pages.deliveryAndPayment.heading'),
            item: `${siteUrl}${PAGE_PATH}`,
          },
        ],
      },
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
