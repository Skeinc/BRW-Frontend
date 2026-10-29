import { queryOptions, useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import type { Paginated } from '@/shared/api';
import type { Slide, SlideListParams } from '../model/types';
import { fetchSlidesPage, moveSlide } from './slide-api';

/** Prefix of every slide query. */
export const slidesQueryKey = ['admin', 'slides'] as const;

export const slidesPageQueryOptions = (params: SlideListParams) =>
  queryOptions({
    queryKey: [...slidesQueryKey, 'page', params],
    queryFn: () => fetchSlidesPage(params),
  });

/** The loaded page with `activeId` moved to the place of `overId`. */
function moveInPage(rows: readonly Slide[], activeId: string, overId: string): Slide[] {
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

/** Moves a slide; the shown page updates at once and rolls back if the API refuses. */
export function useMoveSlide(pageQueryKey: QueryKey) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, overId }: { id: string; overId: string }) => moveSlide(id, overId),
    onMutate: async ({ id, overId }) => {
      await queryClient.cancelQueries({ queryKey: pageQueryKey });
      const previous = queryClient.getQueryData<Paginated<Slide>>(pageQueryKey);
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: slidesQueryKey }),
  });
}
