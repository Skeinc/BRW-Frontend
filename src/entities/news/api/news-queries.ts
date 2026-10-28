import { queryOptions } from '@tanstack/react-query';
import type { NewsListParams } from '../model/types';
import { fetchNewsItem, fetchNewsPage } from './news-api';

/** Prefix of every news item query, to invalidate lists and cards together. */
export const newsQueryKey = ['admin', 'news'] as const;

export const newsPageQueryOptions = (params: NewsListParams) =>
  queryOptions({
    queryKey: [...newsQueryKey, 'page', params],
    queryFn: () => fetchNewsPage(params),
  });

export const newsItemQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [...newsQueryKey, 'detail', id],
    queryFn: () => fetchNewsItem(id),
  });
