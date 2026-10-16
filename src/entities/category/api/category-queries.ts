import { queryOptions, useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import type { Paginated } from '@/shared/api';
import { moveInPage } from '../lib/move-in-page';
import type { Category, CategoryListParams } from '../model/types';
import { fetchCategoriesPage, fetchCategoryTree, moveCategory } from './category-api';

/** Prefix of every category query, to invalidate pages and the tree together. */
export const categoriesQueryKey = ['admin', 'categories'] as const;

export const categoriesPageQueryOptions = (params: CategoryListParams) =>
  queryOptions({
    queryKey: [...categoriesQueryKey, 'page', params],
    queryFn: () => fetchCategoriesPage(params),
  });

export const categoryTreeQueryOptions = queryOptions({
  queryKey: [...categoriesQueryKey, 'tree'],
  queryFn: fetchCategoryTree,
});

/** Moves a category; the shown page updates at once and rolls back if the API refuses. */
export function useMoveCategory(pageQueryKey: QueryKey) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, overId }: { id: string; overId: string }) => moveCategory(id, overId),
    onMutate: async ({ id, overId }) => {
      await queryClient.cancelQueries({ queryKey: pageQueryKey });
      const previous = queryClient.getQueryData<Paginated<Category>>(pageQueryKey);
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: categoriesQueryKey }),
  });
}
