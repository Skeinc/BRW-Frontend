import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { catalogSearchSchema, getCatalogListSeo } from '@/entities/product';
import { catalogRoomCollectionQueryOptions } from '@/entities/room';
import { RoomCollectionPage } from '@/pages/room-collection';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildBreadcrumbTrailJsonLd } from '@/shared/lib/build-breadcrumb-json-ld';
import { buildHead } from '@/shared/lib/build-head';
import { rethrowAsNotFound } from '@/shared/lib/rethrow-as-not-found';

export const Route = createFileRoute('/room/$roomId/$collectionId')({
  validateSearch: catalogSearchSchema.extend({ solution: z.string().optional().catch(undefined) }),
  loader: async ({ context, params }) => {
    const data = await context.queryClient
      .ensureQueryData(catalogRoomCollectionQueryOptions(params.roomId, params.collectionId))
      .catch(rethrowAsNotFound);
    return { data };
  },
  head: ({ loaderData, params, match, matches }) => {
    const language = readHeadLanguage(matches);
    const data = loaderData?.data;
    const path = `/room/${params.roomId}/${params.collectionId}`;
    const seo = getCatalogListSeo(path, { ...match.search, collection: undefined });
    if (!data) {
      return buildHead({
        title: translate(language, 'pages.room.fallbackTitle'),
        description: translate(language, 'pages.catalog.description'),
        path,
      });
    }
    const { room, collection } = data;
    const names = { room: room.name, name: collection.name };
    return buildHead({
      title: collection.seoTitle ?? translate(language, 'pages.roomCollection.title', names),
      description: collection.seoDescription ?? translate(language, 'pages.roomCollection.description', names),
      path: seo.path,
      isNoIndex: seo.isNoIndex,
      jsonLd: {
        '@context': 'https://schema.org',
        ...buildBreadcrumbTrailJsonLd(language, [
          { name: room.name, path: `/room/${room.id}` },
          { name: collection.name, path },
        ]),
      },
    });
  },
  component: RoomCollectionPage,
});
