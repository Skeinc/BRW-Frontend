import { apiRequest, toQueryString, type Paginated } from '@/shared/api';
import type { CatalogArticle, CatalogArticleCard, CatalogArticlesParams } from '../model/catalog-types';

/** One page of published articles, newest first. */
export function fetchCatalogArticles(params: CatalogArticlesParams): Promise<Paginated<CatalogArticleCard>> {
  return apiRequest<Paginated<CatalogArticleCard>>(`/articles${toQueryString({ ...params })}`);
}

export function fetchCatalogArticle(id: string): Promise<CatalogArticle> {
  return apiRequest<CatalogArticle>(`/articles/${id}`);
}
