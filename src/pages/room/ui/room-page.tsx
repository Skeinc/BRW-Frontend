import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { catalogRoomQueryOptions, RoomCollectionCard } from '@/entities/room';
import { BreadcrumbTrail } from '@/shared/ui/breadcrumb-trail';
import { CollapsibleText } from '@/shared/ui/collapsible-text';

const route = getRouteApi('/room/$roomId/');

export function RoomPage() {
  const { t } = useTranslation();
  const { roomId } = route.useParams();
  const { data: room } = useSuspenseQuery(catalogRoomQueryOptions(roomId));
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <BreadcrumbTrail steps={[{ label: room.name }]} />
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{room.name}</h1>
        <p className="text-muted-foreground">{t('rooms.collectionsCount', { count: room.collections.length })}</p>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {room.collections.map((collection) => (
          <li key={collection.id}>
            <RoomCollectionCard roomId={room.id} collection={collection} />
          </li>
        ))}
      </ul>
      {room.description && (
        <div className="mt-12 max-w-3xl">
          <CollapsibleText text={room.description} />
        </div>
      )}
    </section>
  );
}
