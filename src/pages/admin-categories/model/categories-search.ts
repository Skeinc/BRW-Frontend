import { z } from 'zod';
import type { CategoryListParams } from '@/entities/category';
import { tablePageSearchSchema } from '@/shared/lib/table-search';

/** The category tree is read as a whole, so a page holds 100 rows by default. */
const CATEGORIES_DEFAULT_PAGE_SIZE = 100;

export const categoriesSearchSchema = tablePageSearchSchema.extend({
  q: z.string().optional().catch(undefined),
  published: z.enum(['yes', 'no']).optional().catch(undefined),
  level: z.coerce.number().int().min(1).max(3).optional().catch(undefined),
  /** A category id to open in the edit form on arrival, for links from other screens. */
  edit: z.uuid().optional().catch(undefined),
});

export type CategoriesSearch = z.infer<typeof categoriesSearchSchema>;

export function hasCategoryFilters(search: CategoriesSearch): boolean {
  return Boolean(search.q || search.published || search.level);
}

/** Query params of the API list for the URL search of the screen. */
export function toCategoryListParams(search: CategoriesSearch): CategoryListParams {
  return {
    page: search.page ?? 1,
    pageSize: search.pageSize ?? CATEGORIES_DEFAULT_PAGE_SIZE,
    q: search.q?.trim() || undefined,
    isPublished: search.published ? search.published === 'yes' : undefined,
    depth: search.level,
  };
}
