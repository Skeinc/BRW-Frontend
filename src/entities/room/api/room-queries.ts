import { queryOptions, useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import type { Paginated } from '@/shared/api';
import type { Room, RoomListParams } from '../model/types';
import { fetchRoomsPage, moveRoom } from './room-api';

/** Prefix of every admin room query. */
export const roomsQueryKey = ['admin', 'rooms'] as const;

/** Most rooms an options list can hold; the API pages at 100. */
const ROOM_OPTIONS_LIMIT = 100;

export const roomsPageQueryOptions = (params: RoomListParams) =>
  queryOptions({
    queryKey: [...roomsQueryKey, 'page', params],
    queryFn: () => fetchRoomsPage(params),
  });

/** The loaded page with `activeId` moved to the place of `overId`. */
function moveInPage(rows: readonly Room[], activeId: string, overId: string): Room[] {
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

/** Moves a room; the shown page updates at once and rolls back if the API refuses. */
export function useMoveRoom(pageQueryKey: QueryKey) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, overId }: { id: string; overId: string }) => moveRoom(id, overId),
    onMutate: async ({ id, overId }) => {
      await queryClient.cancelQueries({ queryKey: pageQueryKey });
      const previous = queryClient.getQueryData<Paginated<Room>>(pageQueryKey);
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: roomsQueryKey }),
  });
}

/** Every room as id and name, for pickers and filters. */
export const roomOptionsQueryOptions = queryOptions({
  queryKey: [...roomsQueryKey, 'options'],
  queryFn: () => fetchRoomsPage({ page: 1, pageSize: ROOM_OPTIONS_LIMIT }),
  select: (data) => data.items.map((item) => ({ id: item.id, name: item.name })),
});
