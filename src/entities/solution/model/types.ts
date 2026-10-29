import type { MediaCover, MediaImage } from '@/entities/media';

export interface Solution {
  id: string;
  roomId: string;
  roomName: string;
  collectionId: string;
  collectionName: string;
  name: string;
  description: string | null;
  price: string;
  sortOrder: number;
  isPublished: boolean;
  productCount: number;
  cover: MediaCover | null;
}

export interface SolutionElement {
  id: string;
  name: string;
}

export interface SolutionDetail extends Solution {
  images: MediaImage[];
  products: SolutionElement[];
}

export interface SolutionInput {
  roomId: string;
  collectionId: string;
  name: string;
  description?: string | null;
  price: string;
  isPublished?: boolean;
  productIds?: string[];
}

export interface SolutionListParams {
  page: number;
  pageSize: number;
  q?: string;
  roomId?: string;
  collectionId?: string;
}
