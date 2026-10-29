import { apiRequest } from '@/shared/api';
import type { CatalogCollection } from '../model/catalog-types';

/** Published collections for the storefront. */
export function fetchCatalogCollections(): Promise<CatalogCollection[]> {
  return apiRequest<CatalogCollection[]>('/collections');
}
