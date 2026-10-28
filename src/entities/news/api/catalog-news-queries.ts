import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import type { CatalogNewsParams } from '../model/catalog-types';
import { fetchCatalogNewsItem, fetchCatalogNews } from './catalog-news-api';

export const catalogNewsQueryOptions = (params: CatalogNewsParams) =>
  queryOptions({
    queryKey: ['news', 'list', params],
    queryFn: () => fetchCatalogNews(params),
    placeholderData: keepPreviousData,
  });

export const catalogNewsItemQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['news', 'detail', id],
    queryFn: () => fetchCatalogNewsItem(id),
  });
