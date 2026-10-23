import { queryOptions } from '@tanstack/react-query';
import { fetchCatalogCollection } from './catalog-collection-api';

export const catalogCollectionQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['catalog', 'collection', id],
    queryFn: () => fetchCatalogCollection(id),
  });
