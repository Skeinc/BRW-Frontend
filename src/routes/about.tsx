import { createFileRoute } from '@tanstack/react-router';
import { AboutPage } from '@/pages/about';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildHead } from '@/shared/lib/build-head';
import { buildOrganizationJsonLd } from '@/shared/lib/build-organization-json-ld';

export const Route = createFileRoute('/about')({
  head: ({ matches }) => {
    const language = readHeadLanguage(matches);
    return buildHead({
      title: translate(language, 'pages.about.title'),
      description: translate(language, 'pages.about.description'),
      path: '/about',
      jsonLd: buildOrganizationJsonLd(language),
    });
  },
  component: AboutPage,
});
