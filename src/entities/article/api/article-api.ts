import { apiRequest, toQueryString, type Paginated } from '@/shared/api';
import type { Article, ArticleInput, ArticleListItem, ArticleListParams } from '../model/types';

export function fetchArticlesPage(params: ArticleListParams): Promise<Paginated<ArticleListItem>> {
  return apiRequest<Paginated<ArticleListItem>>(`/admin/articles${toQueryString({ ...params })}`);
}

export function fetchArticle(id: string): Promise<Article> {
  return apiRequest<Article>(`/admin/articles/${id}`);
}

export function createArticle(input: ArticleInput): Promise<Article> {
  return apiRequest<Article>('/admin/articles', { method: 'POST', body: JSON.stringify(input) });
}

export function updateArticle(id: string, input: ArticleInput): Promise<Article> {
  return apiRequest<Article>(`/admin/articles/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
}

export function deleteArticle(id: string): Promise<void> {
  return apiRequest<void>(`/admin/articles/${id}`, { method: 'DELETE' });
}
