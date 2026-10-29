import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { catalogRoomsQueryOptions, RoomCard } from '@/entities/room';

export function HomeRooms() {
  const { t } = useTranslation();
  const { data: rooms } = useQuery(catalogRoomsQueryOptions);
  if (!rooms || rooms.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby="home-rooms" className="mx-auto w-full max-w-7xl px-4">
      <h2 id="home-rooms" className="text-2xl font-bold tracking-tight md:text-3xl">
        {t('pages.home.rooms.title')}
      </h2>
      <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <li key={room.id}>
            <RoomCard room={room} />
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-end">
        <Link
          to="/room"
          className="inline-flex items-center gap-1 text-sm font-medium tracking-wide text-primary uppercase hover:underline"
        >
          {t('pages.home.rooms.more')}
          <ChevronDown aria-hidden className="size-4" />
        </Link>
      </div>
    </section>
  );
}
