import { createFileRoute } from '@tanstack/react-router';
import { catalogCategoryQueryOptions } from '@/entities/category';
import {
  catalogProductFacetsQueryOptions,
  catalogProductsQueryOptions,
  catalogSearchSchema,
  getCatalogListSeo,
  toCatalogFilters,
  toCatalogParams,
} from '@/entities/product';
import { CategoryPage } from '@/pages/category';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildBreadcrumbTrailJsonLd } from '@/shared/lib/build-breadcrumb-json-ld';
import { buildHead } from '@/shared/lib/build-head';
import { rethrowAsNotFound } from '@/shared/lib/rethrow-as-not-found';

export const Route = createFileRoute('/catalog/$categoryId')({
  validateSearch: catalogSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, params, deps }) => {
    const category = await context.queryClient
      .ensureQueryData(catalogCategoryQueryOptions(params.categoryId))
      .catch(rethrowAsNotFound);
    const pinned = { category: category.slug };
    await Promise.allSettled([
      context.queryClient.ensureQueryData(catalogProductsQueryOptions(toCatalogParams(deps, pinned))),
      context.queryClient.ensureQueryData(catalogProductFacetsQueryOptions(toCatalogFilters(deps, pinned))),
    ]);
    return { category };
  },
  head: ({ loaderData, params, match, matches }) => {
    const language = readHeadLanguage(matches);
    const category = loaderData?.category;
    const path = `/catalog/${params.categoryId}`;
    if (!category) {
      return buildHead({
        title: translate(language, 'pages.category.fallbackTitle'),
        description: translate(language, 'pages.catalog.description'),
        path,
      });
    }
    const seo = getCatalogListSeo(path, match.search);
    return buildHead({
      title: category.seoTitle ?? translate(language, 'pages.category.title', { name: category.name }),
      description:
        category.seoDescription ?? translate(language, 'pages.category.description', { name: category.name }),
      path: seo.path,
      isNoIndex: seo.isNoIndex,
      jsonLd: {
        '@context': 'https://schema.org',
        ...buildBreadcrumbTrailJsonLd(language, [
          { name: translate(language, 'nav.catalog'), path: '/catalog' },
          ...category.breadcrumbs.map((step) => ({ name: step.name, path: `/catalog/${step.id}` })),
        ]),
      },
    });
  },
  component: CategoryPage,
});
