import type { MediaCover, MediaImage } from '@/entities/media';

export interface Slide {
  id: string;
  alt: string;
  linkUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
  cover: MediaCover | null;
}

export interface SlideDetail extends Slide {
  images: MediaImage[];
}

export interface SlideInput {
  alt: string;
  linkUrl?: string | null;
  isPublished?: boolean;
}

export interface SlideListParams {
  page: number;
  pageSize: number;
}
