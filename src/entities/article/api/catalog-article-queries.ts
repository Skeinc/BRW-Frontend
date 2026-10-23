import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import type { CatalogArticlesParams } from '../model/catalog-types';
import { fetchCatalogArticle, fetchCatalogArticles } from './catalog-article-api';

export const catalogArticlesQueryOptions = (params: CatalogArticlesParams) =>
  queryOptions({
    queryKey: ['articles', 'list', params],
    queryFn: () => fetchCatalogArticles(params),
    placeholderData: keepPreviousData,
  });

export const catalogArticleQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['articles', 'detail', id],
    queryFn: () => fetchCatalogArticle(id),
  });
