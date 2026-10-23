import { apiRequest } from '@/shared/api';
import type { CatalogCollectionDetail } from '../model/catalog-types';

export function fetchCatalogCollection(id: string): Promise<CatalogCollectionDetail> {
  return apiRequest<CatalogCollectionDetail>(`/collections/${id}`);
}
