import { z } from 'zod';
import type { CollectionListParams } from '@/entities/collection';
import { DEFAULT_TABLE_PAGE_SIZE, tablePageSearchSchema } from '@/shared/lib/table-search';

export const collectionsSearchSchema = tablePageSearchSchema.extend({
  q: z.string().optional().catch(undefined),
  published: z.enum(['yes', 'no']).optional().catch(undefined),
  contents: z.enum(['with', 'empty']).optional().catch(undefined),
  /** A collection id to open in the edit form on arrival, for links from other screens. */
  edit: z.uuid().optional().catch(undefined),
});

export type CollectionsSearch = z.infer<typeof collectionsSearchSchema>;

export function hasCollectionFilters(search: CollectionsSearch): boolean {
  return Boolean(search.q || search.published || search.contents);
}

/** Query params of the API list for the URL search of the screen. */
export function toCollectionListParams(search: CollectionsSearch): CollectionListParams {
  return {
    page: search.page ?? 1,
    pageSize: search.pageSize ?? DEFAULT_TABLE_PAGE_SIZE,
    q: search.q?.trim() || undefined,
    isPublished: search.published ? search.published === 'yes' : undefined,
    hasProducts: search.contents ? search.contents === 'with' : undefined,
  };
}
