import { apiRequest, toQueryString, type Paginated } from '@/shared/api';
import type { CatalogProductCard, CatalogProductsParams } from '../model/catalog-types';

/** One page of published products for the storefront. */
export function fetchCatalogProducts(params: CatalogProductsParams): Promise<Paginated<CatalogProductCard>> {
  return apiRequest<Paginated<CatalogProductCard>>(`/products${toQueryString({ ...params })}`);
}
