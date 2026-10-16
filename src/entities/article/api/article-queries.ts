import { queryOptions } from '@tanstack/react-query';
import type { ArticleListParams } from '../model/types';
import { fetchArticle, fetchArticlesPage } from './article-api';

/** Prefix of every article query, to invalidate lists and cards together. */
export const articlesQueryKey = ['admin', 'articles'] as const;

export const articlesPageQueryOptions = (params: ArticleListParams) =>
  queryOptions({
    queryKey: [...articlesQueryKey, 'page', params],
    queryFn: () => fetchArticlesPage(params),
  });

export const articleQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [...articlesQueryKey, 'detail', id],
    queryFn: () => fetchArticle(id),
  });
