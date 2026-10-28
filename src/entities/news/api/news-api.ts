import { apiRequest, toQueryString, type Paginated } from '@/shared/api';
import type { NewsItem, NewsItemInput, NewsListItem, NewsListParams } from '../model/types';

export function fetchNewsPage(params: NewsListParams): Promise<Paginated<NewsListItem>> {
  return apiRequest<Paginated<NewsListItem>>(`/admin/news${toQueryString({ ...params })}`);
}

export function fetchNewsItem(id: string): Promise<NewsItem> {
  return apiRequest<NewsItem>(`/admin/news/${id}`);
}

export function createNewsItem(input: NewsItemInput): Promise<NewsItem> {
  return apiRequest<NewsItem>('/admin/news', { method: 'POST', body: JSON.stringify(input) });
}

export function updateNewsItem(id: string, input: NewsItemInput): Promise<NewsItem> {
  return apiRequest<NewsItem>(`/admin/news/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
}

export function deleteNewsItem(id: string): Promise<void> {
  return apiRequest<void>(`/admin/news/${id}`, { method: 'DELETE' });
}
