import { queryOptions } from '@tanstack/react-query';
import type { ProductListParams } from '../model/types';
import { fetchProduct, fetchProductsPage } from './product-api';

/** Prefix of every product query, to invalidate lists and cards together. */
export const productsQueryKey = ['admin', 'products'] as const;

export const productsPageQueryOptions = (params: ProductListParams) =>
  queryOptions({
    queryKey: [...productsQueryKey, 'page', params],
    queryFn: () => fetchProductsPage(params),
  });

export const productQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [...productsQueryKey, 'detail', id],
    queryFn: () => fetchProduct(id),
  });
