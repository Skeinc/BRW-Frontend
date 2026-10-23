import { createFileRoute } from '@tanstack/react-router';
import {
  catalogProductFacetsQueryOptions,
  catalogProductsQueryOptions,
  catalogSearchSchema,
  toCatalogFilters,
  toCatalogParams,
} from '@/entities/product';
import { SearchPage } from '@/pages/search';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildHead } from '@/shared/lib/build-head';

export const Route = createFileRoute('/search')({
  validateSearch: catalogSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    if (!deps.q) {
      return;
    }
    await Promise.allSettled([
      context.queryClient.ensureQueryData(catalogProductsQueryOptions(toCatalogParams(deps))),
      context.queryClient.ensureQueryData(catalogProductFacetsQueryOptions(toCatalogFilters(deps))),
    ]);
  },
  head: ({ match, matches }) => {
    const language = readHeadLanguage(matches);
    return buildHead({
      title: match.search.q
        ? translate(language, 'pages.search.titleWithQuery', { q: match.search.q })
        : translate(language, 'pages.search.title'),
      description: translate(language, 'pages.search.description'),
      path: '/search',
      isNoIndex: true,
    });
  },
  component: SearchPage,
});
