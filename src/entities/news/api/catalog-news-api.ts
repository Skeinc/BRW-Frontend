import { apiRequest, toQueryString, type Paginated } from '@/shared/api';
import type { CatalogNewsItem, CatalogNewsCard, CatalogNewsParams } from '../model/catalog-types';

/** One page of published news, newest first. */
export function fetchCatalogNews(params: CatalogNewsParams): Promise<Paginated<CatalogNewsCard>> {
  return apiRequest<Paginated<CatalogNewsCard>>(`/news${toQueryString({ ...params })}`);
}

export function fetchCatalogNewsItem(id: string): Promise<CatalogNewsItem> {
  return apiRequest<CatalogNewsItem>(`/news/${id}`);
}
