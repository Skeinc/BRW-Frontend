import { createFileRoute } from '@tanstack/react-router';
import { CatalogPage } from '@/pages/catalog';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildHead } from '@/shared/lib/build-head';

export const Route = createFileRoute('/catalog/')({
  head: ({ matches }) => {
    const language = readHeadLanguage(matches);
    return buildHead({
      title: translate(language, 'pages.catalog.title'),
      description: translate(language, 'pages.catalog.description'),
      path: '/catalog',
    });
  },
  component: CatalogPage,
});
