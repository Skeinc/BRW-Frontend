import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import type { GalleryOwner, MediaImage } from '../model/types';
import {
  deleteGalleryImage,
  fetchGallery,
  reorderGallery,
  updateGalleryImageAlt,
  uploadGalleryImage,
} from './gallery-api';

export const galleryQueryKey = (owner: GalleryOwner, ownerId: string) => ['admin', 'gallery', owner, ownerId] as const;

export const galleryQueryOptions = (owner: GalleryOwner, ownerId: string) =>
  queryOptions({ queryKey: galleryQueryKey(owner, ownerId), queryFn: () => fetchGallery(owner, ownerId) });

/** Refreshes the gallery and the owner's lists, whose `cover` depends on the first image. */
function useInvalidateGallery(owner: GalleryOwner, ownerId: string) {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: galleryQueryKey(owner, ownerId) }),
      queryClient.invalidateQueries({ queryKey: ['admin', owner] }),
    ]);
}

export function useUploadGalleryImage(owner: GalleryOwner, ownerId: string) {
  const invalidate = useInvalidateGallery(owner, ownerId);
  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (percent: number) => void }) =>
      uploadGalleryImage(owner, ownerId, file, onProgress),
    onSuccess: invalidate,
  });
}

export function useReorderGallery(owner: GalleryOwner, ownerId: string) {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateGallery(owner, ownerId);
  const key = galleryQueryKey(owner, ownerId);
  return useMutation({
    mutationFn: (imageIds: string[]) => reorderGallery(owner, ownerId, imageIds),
    onMutate: async (imageIds) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<MediaImage[]>(key);
      if (previous) {
        const byId = new Map(previous.map((image) => [image.id, image]));
        queryClient.setQueryData(
          key,
          imageIds.flatMap((id) => byId.get(id) ?? []),
        );
      }
      return { previous };
    },
    onError: (_error, _ids, context) => {
      if (context?.previous) {
        queryClient.setQueryData(key, context.previous);
      }
    },
    onSettled: invalidate,
  });
}

export function useUpdateGalleryImageAlt(owner: GalleryOwner, ownerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ imageId, alt }: { imageId: string; alt: string }) =>
      updateGalleryImageAlt(owner, ownerId, imageId, alt),
    onSuccess: (updated) => {
      queryClient.setQueryData<MediaImage[]>(galleryQueryKey(owner, ownerId), (images) =>
        images?.map((image) => (image.id === updated.id ? updated : image)),
      );
    },
  });
}

export function useDeleteGalleryImage(owner: GalleryOwner, ownerId: string) {
  const invalidate = useInvalidateGallery(owner, ownerId);
  return useMutation({
    mutationFn: (imageId: string) => deleteGalleryImage(owner, ownerId, imageId),
    onSuccess: invalidate,
  });
}
