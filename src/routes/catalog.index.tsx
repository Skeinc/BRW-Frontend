import { createFileRoute } from '@tanstack/react-router';
import { catalogCategoriesQueryOptions } from '@/entities/category';
import { CatalogPage } from '@/pages/catalog';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildBreadcrumbJsonLd } from '@/shared/lib/build-breadcrumb-json-ld';
import { buildHead } from '@/shared/lib/build-head';

export const Route = createFileRoute('/catalog/')({
  loader: async ({ context }) => {
    await Promise.allSettled([context.queryClient.ensureQueryData(catalogCategoriesQueryOptions)]);
  },
  head: ({ matches }) => {
    const language = readHeadLanguage(matches);
    return buildHead({
      title: translate(language, 'pages.catalog.title'),
      description: translate(language, 'pages.catalog.description'),
      path: '/catalog',
      jsonLd: {
        '@context': 'https://schema.org',
        ...buildBreadcrumbJsonLd(language, translate(language, 'nav.catalog'), '/catalog'),
      },
    });
  },
  component: CatalogPage,
});
