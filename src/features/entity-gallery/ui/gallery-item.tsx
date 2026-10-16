import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MediaImage } from '@/entities/media';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

interface GalleryItemProps {
  image: MediaImage;
  isCover: boolean;
  onAltChange: (imageId: string, alt: string) => void;
  onDelete: (image: MediaImage) => void;
}

export function GalleryItem({ image, isCover, onAltChange, onDelete }: GalleryItemProps) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id });
  const [alt, setAlt] = useState(image.alt ?? '');

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn('flex flex-col gap-2 rounded-lg border bg-card p-2', isDragging && 'z-10 opacity-60 shadow-lg')}
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
        <img
          src={image.thumbUrl}
          alt={image.alt ?? ''}
          width={image.width}
          height={image.height}
          loading="lazy"
          className="size-full object-cover"
        />
        {isCover ? <Badge className="absolute top-1.5 left-1.5">{t('admin.gallery.cover')}</Badge> : null}
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute top-1 right-1 size-11 cursor-grab touch-none active:cursor-grabbing"
          aria-label={t('admin.gallery.drag')}
          {...attributes}
          {...listeners}
        >
          <GripVertical aria-hidden />
        </Button>
      </div>
      <div className="flex items-center gap-1">
        <Input
          value={alt}
          maxLength={255}
          placeholder={t('admin.gallery.altPlaceholder')}
          aria-label={t('admin.gallery.alt')}
          onChange={(event) => setAlt(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              event.currentTarget.blur();
            }
          }}
          onBlur={() => {
            if (alt !== (image.alt ?? '')) {
              onAltChange(image.id, alt);
            }
          }}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11 shrink-0 text-destructive"
          aria-label={t('admin.gallery.delete')}
          onClick={() => onDelete(image)}
        >
          <Trash2 aria-hidden />
        </Button>
      </div>
    </li>
  );
}
