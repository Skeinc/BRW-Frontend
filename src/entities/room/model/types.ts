import type { MediaCover, MediaImage } from '@/entities/media';

export interface Room {
  id: string;
  name: string;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  sortOrder: number;
  isPublished: boolean;
  /** Kitchens: no solutions and no cart, the room shows `collectionIds` with photos, text and contacts. */
  isConsultationOnly: boolean;
  /** Collections of a consultation-only room, in display order. */
  collectionIds: string[];
  solutionCount: number;
  cover: MediaCover | null;
}

export interface RoomDetail extends Room {
  images: MediaImage[];
}

export interface RoomInput {
  name: string;
  description?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  isPublished?: boolean;
  isConsultationOnly?: boolean;
  /** Replaces the collections of the room; their order is the display order. */
  collectionIds?: string[];
}

export interface RoomListParams {
  page: number;
  pageSize: number;
  q?: string;
  isPublished?: boolean;
}
