import { apiRequest, toQueryString, type Paginated } from '@/shared/api';
import type { Collection, CollectionDetail, CollectionInput, CollectionListParams } from '../model/types';

export function fetchCollectionsPage(params: CollectionListParams): Promise<Paginated<Collection>> {
  return apiRequest<Paginated<Collection>>(`/admin/collections${toQueryString({ ...params })}`);
}

export function createCollection(input: CollectionInput): Promise<CollectionDetail> {
  return apiRequest<CollectionDetail>('/admin/collections', { method: 'POST', body: JSON.stringify(input) });
}

export function updateCollection(id: string, input: Partial<CollectionInput>): Promise<CollectionDetail> {
  return apiRequest<CollectionDetail>(`/admin/collections/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
}

/** Puts a collection where another one is now; the API renumbers the ones in between. */
export function moveCollection(id: string, overId: string): Promise<void> {
  return apiRequest<void>(`/admin/collections/${id}/move`, { method: 'PATCH', body: JSON.stringify({ overId }) });
}

export function deleteCollection(id: string): Promise<void> {
  return apiRequest<void>(`/admin/collections/${id}`, { method: 'DELETE' });
}
