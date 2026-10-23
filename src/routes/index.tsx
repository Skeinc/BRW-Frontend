import { createFileRoute } from '@tanstack/react-router';
import { catalogCategoriesQueryOptions } from '@/entities/category';
import { catalogProductsQueryOptions, HITS_PARAMS, NEW_ARRIVALS_PARAMS } from '@/entities/product';
import { HomePage } from '@/pages/home';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildHead } from '@/shared/lib/build-head';
import { buildOrganizationJsonLd } from '@/shared/lib/build-organization-json-ld';

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await Promise.allSettled([
      context.queryClient.ensureQueryData(catalogCategoriesQueryOptions),
      context.queryClient.ensureQueryData(catalogProductsQueryOptions(NEW_ARRIVALS_PARAMS)),
      context.queryClient.ensureQueryData(catalogProductsQueryOptions(HITS_PARAMS)),
    ]);
  },
  head: ({ matches }) => {
    const language = readHeadLanguage(matches);
    return buildHead({
      title: translate(language, 'pages.home.title'),
      description: translate(language, 'pages.home.description'),
      path: '/',
      jsonLd: buildOrganizationJsonLd(language),
    });
  },
  component: HomePage,
});
