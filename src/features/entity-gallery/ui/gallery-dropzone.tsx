import { ImagePlus } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GALLERY_ACCEPTED_TYPES } from '@/entities/media';
import { cn } from '@/shared/lib/utils';

interface GalleryDropzoneProps {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
}

export function GalleryDropzone({ onFiles, multiple = true }: GalleryDropzoneProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        onFiles(Array.from(event.dataTransfer.files));
      }}
      className={cn(
        'flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center transition-colors',
        isDragging ? 'border-primary bg-accent' : 'border-border',
      )}
    >
      <ImagePlus className="size-6 text-muted-foreground" aria-hidden />
      <p className="text-sm text-muted-foreground">
        {t(multiple ? 'admin.gallery.dropHint' : 'admin.gallery.dropHintSingle')}
      </p>
      <button
        type="button"
        className="min-h-11 rounded-md px-3 text-sm font-medium text-primary underline-offset-4 hover:underline"
        onClick={() => inputRef.current?.click()}
      >
        {t(multiple ? 'admin.gallery.choose' : 'admin.gallery.chooseSingle')}
      </button>
      <p className="text-xs text-muted-foreground">{t('admin.gallery.limits')}</p>
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        hidden
        accept={GALLERY_ACCEPTED_TYPES.join(',')}
        onChange={(event) => {
          onFiles(Array.from(event.target.files ?? []));
          event.target.value = '';
        }}
      />
    </div>
  );
}
