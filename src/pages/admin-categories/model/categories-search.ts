import { z } from 'zod';
import type { Category, CategoryListParams } from '@/entities/category';
import { DEFAULT_TABLE_PAGE_SIZE, tablePageSearchSchema } from '@/shared/lib/table-search';

export const categoriesSearchSchema = tablePageSearchSchema.extend({
  q: z.string().optional().catch(undefined),
  published: z.enum(['yes', 'no']).optional().catch(undefined),
  level: z.coerce.number().int().min(1).max(3).optional().catch(undefined),
});

export type CategoriesSearch = z.infer<typeof categoriesSearchSchema>;

export function hasCategoryFilters(search: CategoriesSearch): boolean {
  return Boolean(search.q || search.published || search.level);
}

/** Query params of the API list for the URL search of the screen. */
export function toCategoryListParams(search: CategoriesSearch): CategoryListParams {
  return {
    page: search.page ?? 1,
    pageSize: search.pageSize ?? DEFAULT_TABLE_PAGE_SIZE,
    q: search.q?.trim() || undefined,
    isPublished: search.published ? search.published === 'yes' : undefined,
    depth: search.level,
  };
}

/** Rows to show: those whose ancestors are all expanded. `rows` come in tree order, parents first. */
export function getVisibleRows(rows: readonly Category[], collapsedIds: ReadonlySet<string>): Category[] {
  const hiddenIds = new Set<string>();
  return rows.filter((row) => {
    const isHidden = row.parentId !== null && (hiddenIds.has(row.parentId) || collapsedIds.has(row.parentId));
    if (isHidden) {
      hiddenIds.add(row.id);
    }
    return !isHidden;
  });
}
