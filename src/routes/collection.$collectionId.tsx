import { createFileRoute, redirect } from '@tanstack/react-router';
import { resolveRenamedSlug } from '@/entities/seo';
import { catalogCollectionQueryOptions } from '@/entities/collection';
import {
  catalogProductFacetsQueryOptions,
  catalogProductsQueryOptions,
  catalogSearchSchema,
  getCatalogListSeo,
  toCatalogFilters,
  toCatalogParams,
} from '@/entities/product';
import { CollectionPage } from '@/pages/collection';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildBreadcrumbTrailJsonLd } from '@/shared/lib/build-breadcrumb-json-ld';
import { buildHead } from '@/shared/lib/build-head';

export const Route = createFileRoute('/collection/$collectionId')({
  validateSearch: catalogSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, params, deps }) => {
    const collection = await context.queryClient
      .ensureQueryData(catalogCollectionQueryOptions(params.collectionId))
      .catch(async (error: unknown) => {
        const id = await resolveRenamedSlug('collection', params.collectionId, error);
        throw redirect({
          to: '/collection/$collectionId',
          params: { collectionId: id },
          search: deps,
          statusCode: 301,
        });
      });
    const pinned = { collection: collection.slug };
    await Promise.allSettled([
      context.queryClient.ensureQueryData(catalogProductsQueryOptions(toCatalogParams(deps, pinned))),
      context.queryClient.ensureQueryData(catalogProductFacetsQueryOptions(toCatalogFilters(deps, pinned))),
    ]);
    return { collection };
  },
  head: ({ loaderData, params, match, matches }) => {
    const language = readHeadLanguage(matches);
    const collection = loaderData?.collection;
    const path = `/collection/${params.collectionId}`;
    if (!collection) {
      return buildHead({
        title: translate(language, 'pages.collection.fallbackTitle'),
        description: translate(language, 'pages.catalog.description'),
        path,
      });
    }
    const seo = getCatalogListSeo(path, { ...match.search, collection: undefined });
    return buildHead({
      title: collection.seoTitle ?? translate(language, 'pages.collection.title', { name: collection.name }),
      description:
        collection.seoDescription ?? translate(language, 'pages.collection.description', { name: collection.name }),
      path: seo.path,
      isNoIndex: seo.isNoIndex,
      jsonLd: {
        '@context': 'https://schema.org',
        ...buildBreadcrumbTrailJsonLd(
          language,
          collection.breadcrumbs.map((step) => ({ name: step.name, path: `/collection/${step.id}` })),
        ),
      },
    });
  },
  component: CollectionPage,
});
