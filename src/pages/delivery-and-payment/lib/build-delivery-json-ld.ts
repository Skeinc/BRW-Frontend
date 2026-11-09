import { resolveDeliveryContent, type DeliveryPageContent } from '@/entities/delivery-page';
import { translate, type Language } from '@/shared/i18n';
import { buildBreadcrumbJsonLd } from '@/shared/lib/build-breadcrumb-json-ld';

/** schema.org `FAQPage` and `BreadcrumbList` for the delivery and payment page. */
export function buildDeliveryJsonLd(
  language: Language,
  saved: DeliveryPageContent | null | undefined,
): Record<string, unknown> {
  const { faq } = resolveDeliveryContent({ saved, language });
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildBreadcrumbJsonLd(language, translate(language, 'pages.deliveryAndPayment.heading'), '/delivery-and-payment'),
      ...(faq.length > 0
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: faq.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: { '@type': 'Answer', text: item.answer },
              })),
            },
          ]
        : []),
    ],
  };
}
