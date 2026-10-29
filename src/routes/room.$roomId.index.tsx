import { createFileRoute } from '@tanstack/react-router';
import { catalogRoomQueryOptions } from '@/entities/room';
import { RoomPage } from '@/pages/room';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildBreadcrumbJsonLd } from '@/shared/lib/build-breadcrumb-json-ld';
import { buildHead } from '@/shared/lib/build-head';
import { rethrowAsNotFound } from '@/shared/lib/rethrow-as-not-found';

export const Route = createFileRoute('/room/$roomId/')({
  loader: async ({ context, params }) => {
    const room = await context.queryClient
      .ensureQueryData(catalogRoomQueryOptions(params.roomId))
      .catch(rethrowAsNotFound);
    return { room };
  },
  head: ({ loaderData, params, matches }) => {
    const language = readHeadLanguage(matches);
    const room = loaderData?.room;
    const path = `/room/${params.roomId}`;
    if (!room) {
      return buildHead({
        title: translate(language, 'pages.room.fallbackTitle'),
        description: translate(language, 'pages.catalog.description'),
        path,
      });
    }
    return buildHead({
      title: room.seoTitle ?? translate(language, 'pages.room.title', { name: room.name }),
      description: room.seoDescription ?? translate(language, 'pages.room.description', { name: room.name }),
      path,
      jsonLd: { '@context': 'https://schema.org', ...buildBreadcrumbJsonLd(language, room.name, path) },
    });
  },
  component: RoomPage,
});
