import { apiRequest } from '@/shared/api';
import type { CatalogCategory } from '../model/catalog-types';

/** Published category tree for the storefront. */
export function fetchCatalogCategories(): Promise<CatalogCategory[]> {
  return apiRequest<CatalogCategory[]>('/categories');
}
