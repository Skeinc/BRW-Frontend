import { queryOptions } from '@tanstack/react-query';
import { fetchCatalogCollection } from './catalog-collection-api';
import { fetchCatalogCollections } from './catalog-collections-api';

export const catalogCollectionQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['catalog', 'collection', id],
    queryFn: () => fetchCatalogCollection(id),
  });

export const catalogCollectionsQueryOptions = queryOptions({
  queryKey: ['catalog', 'collections'],
  queryFn: fetchCatalogCollections,
});
