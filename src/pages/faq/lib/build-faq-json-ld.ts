import { translate, type Language } from '@/shared/i18n';
import { buildBreadcrumbJsonLd } from '@/shared/lib/build-breadcrumb-json-ld';
import { stripMarkdownLinks, type FaqGroup } from '../model/faq-content';

/** schema.org `FAQPage` with every question of the page, plus the `BreadcrumbList`. */
export function buildFaqJsonLd(language: Language): Record<string, unknown> {
  const groups = translate(language, 'pages.faq.groups', { returnObjects: true }) as unknown as FaqGroup[];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildBreadcrumbJsonLd(language, translate(language, 'pages.faq.heading'), '/faq'),
      {
        '@type': 'FAQPage',
        mainEntity: groups.flatMap((group) =>
          group.items.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: stripMarkdownLinks(item.a) },
          })),
        ),
      },
    ],
  };
}
