import { apiRequest, uploadWithProgress } from '@/shared/api';
import type { GalleryOwner, MediaImage } from '../model/types';

function galleryPath(owner: GalleryOwner, ownerId: string): string {
  return `/admin/${owner}/${ownerId}/images`;
}

export function fetchGallery(owner: GalleryOwner, ownerId: string): Promise<MediaImage[]> {
  return apiRequest<MediaImage[]>(galleryPath(owner, ownerId));
}

export function uploadGalleryImage(
  owner: GalleryOwner,
  ownerId: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<MediaImage> {
  const body = new FormData();
  body.append('file', file);
  return uploadWithProgress<MediaImage>(galleryPath(owner, ownerId), body, onProgress);
}

export function reorderGallery(owner: GalleryOwner, ownerId: string, imageIds: string[]): Promise<MediaImage[]> {
  return apiRequest<MediaImage[]>(`${galleryPath(owner, ownerId)}/order`, {
    method: 'PATCH',
    body: JSON.stringify({ imageIds }),
  });
}

export function updateGalleryImageAlt(
  owner: GalleryOwner,
  ownerId: string,
  imageId: string,
  alt: string,
): Promise<MediaImage> {
  return apiRequest<MediaImage>(`${galleryPath(owner, ownerId)}/${imageId}`, {
    method: 'PATCH',
    body: JSON.stringify({ alt }),
  });
}

export function deleteGalleryImage(owner: GalleryOwner, ownerId: string, imageId: string): Promise<void> {
  return apiRequest<void>(`${galleryPath(owner, ownerId)}/${imageId}`, { method: 'DELETE' });
}
