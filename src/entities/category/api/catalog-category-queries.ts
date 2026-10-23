import { queryOptions } from '@tanstack/react-query';
import { fetchCatalogCategories } from './catalog-category-api';

export const catalogCategoriesQueryOptions = queryOptions({
  queryKey: ['catalog', 'categories'],
  queryFn: fetchCatalogCategories,
});
