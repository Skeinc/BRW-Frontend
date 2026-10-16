import { queryOptions, useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import type { Paginated } from '@/shared/api';
import type { Collection, CollectionListParams } from '../model/types';
import { fetchCollectionsPage, moveCollection } from './collection-api';

/** Prefix of every collection query. */
export const collectionsQueryKey = ['admin', 'collections'] as const;

export const collectionsPageQueryOptions = (params: CollectionListParams) =>
  queryOptions({
    queryKey: [...collectionsQueryKey, 'page', params],
    queryFn: () => fetchCollectionsPage(params),
  });

/** The loaded page with `activeId` moved to the place of `overId`. */
function moveInPage(rows: readonly Collection[], activeId: string, overId: string): Collection[] {
  const from = rows.findIndex((row) => row.id === activeId);
  const to = rows.findIndex((row) => row.id === overId);
  if (from < 0 || to < 0) {
    return [...rows];
  }
  const next = [...rows];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

/** Moves a collection; the shown page updates at once and rolls back if the API refuses. */
export function useMoveCollection(pageQueryKey: QueryKey) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, overId }: { id: string; overId: string }) => moveCollection(id, overId),
    onMutate: async ({ id, overId }) => {
      await queryClient.cancelQueries({ queryKey: pageQueryKey });
      const previous = queryClient.getQueryData<Paginated<Collection>>(pageQueryKey);
      if (previous) {
        queryClient.setQueryData(pageQueryKey, { ...previous, items: moveInPage(previous.items, id, overId) });
      }
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(pageQueryKey, context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: collectionsQueryKey }),
  });
}
