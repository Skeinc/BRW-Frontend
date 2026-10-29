import { apiRequest } from '@/shared/api';
import type { CatalogRoomCollectionDetail, CatalogRoomDetail, CatalogRoomItem } from '../model/catalog-types';

/** Published rooms in display order. */
export function fetchCatalogRooms(): Promise<CatalogRoomItem[]> {
  return apiRequest<CatalogRoomItem[]>('/rooms');
}

export function fetchCatalogRoom(id: string): Promise<CatalogRoomDetail> {
  return apiRequest<CatalogRoomDetail>(`/rooms/${id}`);
}

export function fetchCatalogRoomCollection(roomId: string, collectionId: string): Promise<CatalogRoomCollectionDetail> {
  return apiRequest<CatalogRoomCollectionDetail>(`/rooms/${roomId}/collections/${collectionId}`);
}
