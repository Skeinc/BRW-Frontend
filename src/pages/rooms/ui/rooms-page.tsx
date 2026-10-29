import { useQueries, useSuspenseQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { catalogRoomQueryOptions, catalogRoomsQueryOptions, RoomCollectionCard } from '@/entities/room';
import { BreadcrumbTrail } from '@/shared/ui/breadcrumb-trail';

export function RoomsPage() {
  const { t } = useTranslation();
  const { data: rooms } = useSuspenseQuery(catalogRoomsQueryOptions);
  const details = useQueries({ queries: rooms.map((room) => catalogRoomQueryOptions(room.id)) });
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <BreadcrumbTrail steps={[{ label: t('pages.rooms.heading') }]} />
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t('pages.rooms.heading')}</h1>
      {details.map(({ data: room }) =>
        room ? (
          <section key={room.id} aria-labelledby={`room-${room.id}`} className="mt-10">
            <h2 id={`room-${room.id}`} className="text-xl font-bold tracking-tight md:text-2xl">
              {t('pages.rooms.roomHeading', { name: room.name })}
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {room.collections.map((collection) => (
                <li key={collection.id}>
                  <RoomCollectionCard roomId={room.id} collection={collection} />
                </li>
              ))}
            </ul>
          </section>
        ) : null,
      )}
    </section>
  );
}
