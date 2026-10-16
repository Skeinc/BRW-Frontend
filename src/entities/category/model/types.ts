import type { MediaCover, MediaImage } from '@/entities/media';

export const MAX_CATEGORY_DEPTH = 3;

export interface Category {
  id: string;
  parentId: string | null;
  slug: string;
  name: string;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  sortOrder: number;
  isPublished: boolean;
  /** 1 for root categories. */
  depth: number;
  childCount: number;
  productCount: number;
  cover: MediaCover | null;
}

export interface CategoryDetail extends Category {
  images: MediaImage[];
}

export interface CategoryInput {
  name: string;
  slug?: string;
  parentId?: string | null;
  description?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface CategoryListParams {
  page: number;
  pageSize: number;
  q?: string;
  isPublished?: boolean;
  depth?: number;
}
