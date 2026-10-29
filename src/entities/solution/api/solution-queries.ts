import { queryOptions } from '@tanstack/react-query';
import type { SolutionListParams } from '../model/types';
import { fetchSolution, fetchSolutionsPage } from './solution-api';

/** Prefix of every admin solution query. */
export const solutionsQueryKey = ['admin', 'solutions'] as const;

export const solutionsPageQueryOptions = (params: SolutionListParams) =>
  queryOptions({
    queryKey: [...solutionsQueryKey, 'page', params],
    queryFn: () => fetchSolutionsPage(params),
  });

export const solutionQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [...solutionsQueryKey, 'detail', id],
    queryFn: () => fetchSolution(id),
  });
