import { queryOptions } from '@tanstack/react-query';
import { fetchCatalogSlides } from './catalog-slide-api';

export const catalogSlidesQueryOptions = queryOptions({
  queryKey: ['catalog', 'slides'],
  queryFn: fetchCatalogSlides,
});
