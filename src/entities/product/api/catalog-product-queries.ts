import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import type { CatalogProductFilters, CatalogProductsParams } from '../model/catalog-types';
import { fetchCatalogProduct, fetchCatalogProductFacets, fetchCatalogProducts } from './catalog-product-api';

export const catalogProductsQueryOptions = (params: CatalogProductsParams) =>
  queryOptions({
    queryKey: ['products', 'list', params],
    queryFn: () => fetchCatalogProducts(params),
    placeholderData: keepPreviousData,
  });

export const catalogProductFacetsQueryOptions = (filters: CatalogProductFilters) =>
  queryOptions({
    queryKey: ['products', 'facets', filters],
    queryFn: () => fetchCatalogProductFacets(filters),
    placeholderData: keepPreviousData,
  });

export const catalogProductQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['products', 'detail', id],
    queryFn: () => fetchCatalogProduct(id),
  });
