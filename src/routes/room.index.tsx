import { createFileRoute } from '@tanstack/react-router';
import { catalogRoomQueryOptions, catalogRoomsQueryOptions } from '@/entities/room';
import { RoomsPage } from '@/pages/rooms';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildBreadcrumbJsonLd } from '@/shared/lib/build-breadcrumb-json-ld';
import { buildHead } from '@/shared/lib/build-head';

export const Route = createFileRoute('/room/')({
  loader: async ({ context }) => {
    const rooms = await context.queryClient.ensureQueryData(catalogRoomsQueryOptions).catch(() => []);
    await Promise.allSettled(
      rooms.map((room) => context.queryClient.ensureQueryData(catalogRoomQueryOptions(room.id))),
    );
  },
  head: ({ matches }) => {
    const language = readHeadLanguage(matches);
    return buildHead({
      title: translate(language, 'pages.rooms.title'),
      description: translate(language, 'pages.rooms.description'),
      path: '/room',
      jsonLd: {
        '@context': 'https://schema.org',
        ...buildBreadcrumbJsonLd(language, translate(language, 'pages.rooms.heading'), '/room'),
      },
    });
  },
  component: RoomsPage,
});
