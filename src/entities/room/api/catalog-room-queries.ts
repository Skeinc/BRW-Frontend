import { queryOptions } from '@tanstack/react-query';
import {
  fetchCatalogCollectionSolutions,
  fetchCatalogRoom,
  fetchCatalogRoomCollection,
  fetchCatalogRooms,
} from './catalog-room-api';

export const catalogRoomsQueryOptions = queryOptions({
  queryKey: ['catalog', 'rooms'],
  queryFn: fetchCatalogRooms,
});

export const catalogRoomQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['catalog', 'room', id],
    queryFn: () => fetchCatalogRoom(id),
  });

export const catalogRoomCollectionQueryOptions = (roomId: string, collectionId: string) =>
  queryOptions({
    queryKey: ['catalog', 'room', roomId, 'collection', collectionId],
    queryFn: () => fetchCatalogRoomCollection(roomId, collectionId),
  });

export const catalogCollectionSolutionsQueryOptions = (collectionId: string) =>
  queryOptions({
    queryKey: ['catalog', 'collection', collectionId, 'solutions'],
    queryFn: () => fetchCatalogCollectionSolutions(collectionId),
  });
