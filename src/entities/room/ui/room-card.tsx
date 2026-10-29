import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';
import type { CatalogRoomItem } from '../model/catalog-types';

interface RoomCardProps {
  room: CatalogRoomItem;
}

export function RoomCard({ room }: RoomCardProps) {
  const { t } = useTranslation();
  return (
    <Link
      to="/room/$roomId"
      params={{ roomId: room.id }}
      className="group flex flex-col overflow-hidden rounded-xl bg-muted/60 transition-colors hover:bg-muted"
    >
      <div className="aspect-16/10 overflow-hidden bg-muted">
        {room.imageUrl ? (
          <img
            src={room.imageUrl}
            alt=""
            width={1200}
            height={750}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder kind="collection" className="size-full" iconClassName="size-1/4" />
        )}
      </div>
      <div className="p-4">
        <p className="text-xl font-medium tracking-tight group-hover:text-primary">{room.name}</p>
        <p className="text-sm text-muted-foreground">{t('rooms.collectionsCount', { count: room.collectionCount })}</p>
      </div>
    </Link>
  );
}
