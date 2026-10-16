import type { MediaCover, MediaImage } from '@/entities/media';

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  sortOrder: number;
  isPublished: boolean;
  productCount: number;
  cover: MediaCover | null;
}

export interface CollectionDetail extends Collection {
  images: MediaImage[];
}

export interface CollectionInput {
  name: string;
  slug?: string;
  description?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface CollectionListParams {
  page: number;
  pageSize: number;
  q?: string;
  isPublished?: boolean;
  hasProducts?: boolean;
}
