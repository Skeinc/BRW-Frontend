import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';
import type { CatalogRoomCollection } from '../model/catalog-types';

interface RoomCollectionCardProps {
  roomId: string;
  collection: CatalogRoomCollection;
}

export function RoomCollectionCard({ roomId, collection }: RoomCollectionCardProps) {
  const { t } = useTranslation();
  return (
    <Link
      to="/room/$roomId/$collectionId"
      params={{ roomId, collectionId: collection.id }}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary/40"
    >
      <div className="aspect-4/3 overflow-hidden bg-muted">
        {collection.imageUrl ? (
          <img
            src={collection.imageUrl}
            alt=""
            width={1200}
            height={900}
            loading="lazy"
            className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder kind="collection" className="size-full" iconClassName="size-1/4" />
        )}
      </div>
      <div className="p-4">
        <p className="truncate font-semibold">{collection.name}</p>
        <p className="text-sm text-muted-foreground">
          {t('rooms.solutionsCount', { count: collection.solutionCount })}
        </p>
      </div>
    </Link>
  );
}
