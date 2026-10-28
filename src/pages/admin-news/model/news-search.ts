import { z } from 'zod';
import type { NewsListParams } from '@/entities/news';
import { DEFAULT_TABLE_PAGE_SIZE, tablePageSearchSchema } from '@/shared/lib/table-search';

export const newsSearchSchema = tablePageSearchSchema.extend({
  q: z.string().optional().catch(undefined),
  published: z.enum(['yes', 'no']).optional().catch(undefined),
  promo: z.enum(['yes', 'no']).optional().catch(undefined),
  /** The news item open in the dialog: `new` for the create form, or a news item id. */
  edit: z
    .union([z.literal('new'), z.uuid()])
    .optional()
    .catch(undefined),
});

export type NewsSearch = z.infer<typeof newsSearchSchema>;

export function hasNewsFilters(search: NewsSearch): boolean {
  return Boolean(search.q || search.published || search.promo);
}

/** Query params of the API list for the URL search of the screen. */
export function toNewsListParams(search: NewsSearch): NewsListParams {
  return {
    page: search.page ?? 1,
    pageSize: search.pageSize ?? DEFAULT_TABLE_PAGE_SIZE,
    q: search.q?.trim() || undefined,
    isPublished: search.published ? search.published === 'yes' : undefined,
    isPromo: search.promo ? search.promo === 'yes' : undefined,
  };
}
