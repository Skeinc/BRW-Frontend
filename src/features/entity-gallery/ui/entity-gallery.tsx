import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  galleryQueryOptions,
  useDeleteGalleryImage,
  useReorderGallery,
  useUpdateGalleryImageAlt,
  type GalleryOwner,
  type MediaImage,
} from '@/entities/media';
import { getApiErrorMessage } from '@/shared/api';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';
import { Skeleton } from '@/shared/ui/skeleton';
import { useUploadQueue } from '../model/use-upload-queue';
import { GalleryDropzone } from './gallery-dropzone';
import { GalleryGrid } from './gallery-grid';
import { GallerySingle } from './gallery-single';
import { UploadList } from './upload-list';

interface EntityGalleryProps {
  owner: GalleryOwner;
  ownerId: string;
  /** One photo only: no reordering and no descriptions, to replace it delete it and add another. */
  single?: boolean;
}

export function EntityGallery({ owner, ownerId, single = false }: EntityGalleryProps) {
  const { t } = useTranslation();
  const gallery = useQuery(galleryQueryOptions(owner, ownerId));
  const queue = useUploadQueue(owner, ownerId);
  const reorder = useReorderGallery(owner, ownerId);
  const updateAlt = useUpdateGalleryImageAlt(owner, ownerId);
  const remove = useDeleteGalleryImage(owner, ownerId);
  const [imageToDelete, setImageToDelete] = useState<MediaImage | null>(null);

  const images = gallery.data ?? [];
  const title = t(single ? 'admin.gallery.titleSingle' : 'admin.gallery.title');

  return (
    <section aria-label={title} className="flex flex-col gap-4">
      <h3 className="text-sm font-medium">{title}</h3>
      {single && images.length > 0 ? null : (
        <GalleryDropzone onFiles={(files) => queue.addFiles(single ? files.slice(0, 1) : files)} multiple={!single} />
      )}
      <UploadList items={queue.items} onDismiss={queue.dismiss} />
      {gallery.isPending ? <Skeleton className="h-40 w-full" /> : null}
      {gallery.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {getApiErrorMessage(gallery.error, t)}
        </p>
      ) : null}
      {!single && gallery.isSuccess && images.length === 0 && queue.items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('admin.gallery.empty')}</p>
      ) : null}
      {single && images.length > 0 ? <GallerySingle image={images[0]} onDelete={setImageToDelete} /> : null}
      {!single && images.length > 0 ? (
        <>
          <p className="text-xs text-muted-foreground">{t('admin.gallery.reorderHint')}</p>
          <GalleryGrid
            images={images}
            onReorder={(imageIds) =>
              reorder.mutate(imageIds, { onError: (error) => toast.error(getApiErrorMessage(error, t)) })
            }
            onAltChange={(imageId, alt) =>
              updateAlt.mutate(
                { imageId, alt },
                {
                  onSuccess: () => toast.success(t('admin.gallery.altSaved')),
                  onError: (error) => toast.error(getApiErrorMessage(error, t)),
                },
              )
            }
            onDelete={setImageToDelete}
          />
        </>
      ) : null}
      <ConfirmDialog
        open={imageToDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setImageToDelete(null);
            remove.reset();
          }
        }}
        title={t('admin.gallery.deleteTitle')}
        description={t('admin.gallery.deleteDescription')}
        confirmLabel={t('admin.common.delete')}
        cancelLabel={t('admin.common.cancel')}
        isPending={remove.isPending}
        error={remove.isError ? getApiErrorMessage(remove.error, t) : null}
        onConfirm={() => {
          if (imageToDelete) {
            remove.mutate(imageToDelete.id, {
              onSuccess: () => {
                setImageToDelete(null);
                toast.success(t('admin.gallery.deleted'));
              },
            });
          }
        }}
      />
    </section>
  );
}
