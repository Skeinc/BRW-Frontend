import { apiRequest } from '@/shared/api';
import type { CatalogCategory, CatalogCategoryDetail } from '../model/catalog-types';

/** Published category tree for the storefront. */
export function fetchCatalogCategories(): Promise<CatalogCategory[]> {
  return apiRequest<CatalogCategory[]>('/categories');
}

export function fetchCatalogCategory(id: string): Promise<CatalogCategoryDetail> {
  return apiRequest<CatalogCategoryDetail>(`/categories/${id}`);
}
