export type GalleryOwner =
  'products' | 'categories' | 'collections' | 'articles' | 'news' | 'slides' | 'rooms' | 'solutions';

export interface MediaImage {
  id: string;
  url: string;
  thumbUrl: string;
  alt: string | null;
  sortOrder: number;
  width: number;
  height: number;
}

export interface MediaCover {
  url: string;
  thumbUrl: string;
}

export const GALLERY_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const GALLERY_MAX_FILE_BYTES = 10 * 1024 * 1024;
