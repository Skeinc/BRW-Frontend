import type { MediaCover, MediaImage } from '@/entities/media';

export interface Room {
  id: string;
  name: string;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  sortOrder: number;
  isPublished: boolean;
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
}

export interface RoomListParams {
  page: number;
  pageSize: number;
}
