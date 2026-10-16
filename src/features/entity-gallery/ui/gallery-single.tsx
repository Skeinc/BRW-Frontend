import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { MediaImage } from '@/entities/media';
import { Button } from '@/shared/ui/button';

interface GallerySingleProps {
  image: MediaImage;
  onDelete: (image: MediaImage) => void;
}

export function GallerySingle({ image, onDelete }: GallerySingleProps) {
  const { t } = useTranslation();
  return (
    <div className="relative size-48 overflow-hidden rounded-lg border bg-muted">
      <img
        src={image.thumbUrl}
        alt={image.alt ?? ''}
        width={image.width}
        height={image.height}
        className="size-full object-cover"
      />
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="absolute top-1.5 right-1.5 size-11"
        aria-label={t('admin.gallery.delete')}
        onClick={() => onDelete(image)}
      >
        <Trash2 aria-hidden />
      </Button>
    </div>
  );
}
