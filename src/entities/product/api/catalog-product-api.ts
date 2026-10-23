import { apiRequest, toQueryString, type Paginated } from '@/shared/api';
import type {
  CatalogProductDetail,
  CatalogProductFacets,
  CatalogProductFilters,
  CatalogProductCard,
  CatalogProductsParams,
} from '../model/catalog-types';

/** One page of published products for the storefront. */
export function fetchCatalogProducts(params: CatalogProductsParams): Promise<Paginated<CatalogProductCard>> {
  return apiRequest<Paginated<CatalogProductCard>>(`/products${toQueryString({ ...params })}`);
}

/** Values that the filters can still take for the current selection. */
export function fetchCatalogProductFacets(filters: CatalogProductFilters): Promise<CatalogProductFacets> {
  return apiRequest<CatalogProductFacets>(`/products/facets${toQueryString({ ...filters })}`);
}

export function fetchCatalogProduct(id: string): Promise<CatalogProductDetail> {
  return apiRequest<CatalogProductDetail>(`/products/${id}`);
}
