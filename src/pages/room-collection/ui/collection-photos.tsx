import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CatalogRoomImage } from '@/entities/room';
import { cn } from '@/shared/lib/utils';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';

interface CollectionPhotosProps {
  name: string;
  images: readonly CatalogRoomImage[];
}

/** Photos of a collection: the selected one large, the others as thumbnails below. */
export function CollectionPhotos({ name, images }: CollectionPhotosProps) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];
  if (current === undefined) {
    return (
      <div className="aspect-4/3 overflow-hidden rounded-2xl bg-muted">
        <ImagePlaceholder kind="collection" className="size-full" iconClassName="size-1/4" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-4/3 overflow-hidden rounded-2xl bg-muted">
        <img
          src={current.url}
          srcSet={`${current.thumbUrl} 480w, ${current.url} 1600w`}
          sizes="(min-width: 768px) 60vw, 100vw"
          alt={current.alt ?? name}
          width={current.width}
          height={current.height}
          fetchPriority={index === 0 ? 'high' : undefined}
          className="size-full object-contain"
        />
      </div>
      {images.length > 1 && (
        <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((image, position) => (
            <li key={image.url}>
              <button
                type="button"
                aria-label={t('product.gallery.show', { index: position + 1 })}
                aria-current={position === index}
                onClick={() => setIndex(position)}
                className={cn(
                  'block aspect-square w-full overflow-hidden rounded-xl border-2 bg-muted',
                  position === index ? 'border-primary' : 'border-transparent hover:border-border',
                )}
              >
                <img
                  src={image.thumbUrl}
                  alt=""
                  width={image.width}
                  height={image.height}
                  loading="lazy"
                  className="size-full object-contain"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
