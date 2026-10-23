import { queryOptions } from '@tanstack/react-query';
import type { CatalogProductsParams } from '../model/catalog-types';
import { fetchCatalogProducts } from './catalog-product-api';

export const catalogProductsQueryOptions = (params: CatalogProductsParams) =>
  queryOptions({
    queryKey: ['catalog', 'products', params],
    queryFn: () => fetchCatalogProducts(params),
  });
