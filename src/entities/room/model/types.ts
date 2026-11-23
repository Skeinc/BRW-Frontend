import type { MediaCover, MediaImage } from '@/entities/media';

/** A collection shown in a room, with the number of its solutions there. */
export interface RoomLinkedCollection {
  collectionId: string;
  solutionCount: number;
  publishedSolutionCount: number;
}

export interface Room {
  id: string;
  name: string;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  sortOrder: number;
  isPublished: boolean;
  /** Kitchens: no solutions and no cart, the room shows its collections with photos, text and contacts. */
  isConsultationOnly: boolean;
  /** Collections the room shows, in display order. */
  collections: RoomLinkedCollection[];
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
}

/** A room is created without collections: they are put into rooms from the collection form. */
export interface RoomUpdateInput extends Partial<RoomInput> {
  /** Display order of the collections the room shows; it does not add or remove any. */
  collectionIds?: string[];
}

export interface RoomListParams {
  page: number;
  pageSize: number;
  q?: string;
  isPublished?: boolean;
}

/** A room in pickers, with what decides whether a solution of a collection can be made in it. */
export interface RoomOption {
  id: string;
  name: string;
  isConsultationOnly: boolean;
  collectionIds: string[];
}
