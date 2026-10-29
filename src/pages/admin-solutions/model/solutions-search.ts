import { z } from 'zod';
import type { SolutionListParams } from '@/entities/solution';
import { DEFAULT_TABLE_PAGE_SIZE, tablePageSearchSchema } from '@/shared/lib/table-search';

export const solutionsSearchSchema = tablePageSearchSchema.extend({
  q: z.string().optional().catch(undefined),
  room: z.uuid().optional().catch(undefined),
  collection: z.uuid().optional().catch(undefined),
  /** A solution id to open in the edit form on arrival, for links from other screens. */
  edit: z.uuid().optional().catch(undefined),
});

export type SolutionsSearch = z.infer<typeof solutionsSearchSchema>;

export function hasSolutionFilters(search: SolutionsSearch): boolean {
  return Boolean(search.q || search.room || search.collection);
}

/** Query params of the API list for the URL search of the screen. */
export function toSolutionListParams(search: SolutionsSearch): SolutionListParams {
  return {
    page: search.page ?? 1,
    pageSize: search.pageSize ?? DEFAULT_TABLE_PAGE_SIZE,
    q: search.q?.trim() || undefined,
    roomId: search.room,
    collectionId: search.collection,
  };
}
