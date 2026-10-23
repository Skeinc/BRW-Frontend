import { queryOptions } from '@tanstack/react-query';
import { fetchCatalogCategories, fetchCatalogCategory } from './catalog-category-api';

export const catalogCategoriesQueryOptions = queryOptions({
  queryKey: ['catalog', 'categories'],
  queryFn: fetchCatalogCategories,
});

export const catalogCategoryQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['catalog', 'category', id],
    queryFn: () => fetchCatalogCategory(id),
  });
