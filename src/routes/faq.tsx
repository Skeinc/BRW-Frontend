import { createFileRoute } from '@tanstack/react-router';
import { buildFaqJsonLd, FaqPage } from '@/pages/faq';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildHead } from '@/shared/lib/build-head';

export const Route = createFileRoute('/faq')({
  head: ({ matches }) => {
    const language = readHeadLanguage(matches);
    return buildHead({
      title: translate(language, 'pages.faq.title'),
      description: translate(language, 'pages.faq.description'),
      path: '/faq',
      jsonLd: buildFaqJsonLd(language),
    });
  },
  component: FaqPage,
});
