import { useQueries, useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { catalogRoomQueryOptions, catalogRoomsQueryOptions } from '@/entities/room';

const ROOM_LINK_CLASS =
  'inline-flex h-12 items-center border-b-2 border-transparent px-4 text-[0.9375rem] font-medium transition-colors hover:text-primary xl:px-6';

/** Second row of the desktop header: the rooms, each with a popover of its collections on hover or focus. */
export function HeaderRoomsBar() {
  const { t } = useTranslation();
  const { data: rooms = [] } = useQuery(catalogRoomsQueryOptions);
  const details = useQueries({ queries: rooms.map(({ id }) => catalogRoomQueryOptions(id)) });
  if (rooms.length === 0) {
    return null;
  }
  return (
    <nav aria-label={t('nav.rooms')} className="hidden border-t bg-muted lg:block">
      <ul className="mx-auto flex w-full max-w-6xl items-center px-4">
        {rooms.map((room, index) => {
          const collections = details[index]?.data?.collections ?? [];
          return (
            <li key={room.id} className="group/room relative">
              <Link
                to="/room/$roomId"
                params={{ roomId: room.id }}
                className={ROOM_LINK_CLASS}
                activeProps={{ className: 'border-primary text-primary' }}
              >
                {room.name}
              </Link>
              {collections.length > 0 && (
                <div className="invisible absolute top-full left-0 z-50 min-w-56 rounded-b-lg border bg-card p-2 opacity-0 shadow-lg transition-opacity group-focus-within/room:visible group-focus-within/room:opacity-100 group-hover/room:visible group-hover/room:opacity-100">
                  <ul className="flex flex-col">
                    {collections.map((collection) => (
                      <li key={collection.id}>
                        <Link
                          to="/room/$roomId/$collectionId"
                          params={{ roomId: room.id, collectionId: collection.id }}
                          className="block rounded-md px-3 py-2 text-sm hover:bg-muted hover:text-primary"
                        >
                          {collection.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
