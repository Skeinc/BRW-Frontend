import type { MediaCover, MediaImage } from '@/entities/media';

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  /** Starting price "от …" on the collection page of a consultation-only room (kitchens). */
  priceFrom: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  sortOrder: number;
  isPublished: boolean;
  productCount: number;
  cover: MediaCover | null;
  /** Rooms that show the collection, in room order. */
  rooms: CollectionLinkedRoom[];
}

/** A room that shows a collection, with the number of its solutions there. */
export interface CollectionLinkedRoom {
  roomId: string;
  /** All solutions of the collection in the room: while there are any, the room cannot be unticked. */
  solutionCount: number;
  publishedSolutionCount: number;
}

export interface CollectionDetail extends Collection {
  images: MediaImage[];
}

export interface CollectionInput {
  name: string;
  slug?: string;
  description?: string | null;
  priceFrom?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  sortOrder?: number;
  isPublished?: boolean;
  /** Rooms that show the collection; replaces the current list. */
  roomIds?: string[];
}

export interface CollectionListParams {
  page: number;
  pageSize: number;
  q?: string;
  isPublished?: boolean;
  hasProducts?: boolean;
}
