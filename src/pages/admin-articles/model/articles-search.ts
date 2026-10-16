import { z } from 'zod';
import type { ArticleListParams } from '@/entities/article';
import { DEFAULT_TABLE_PAGE_SIZE, tablePageSearchSchema } from '@/shared/lib/table-search';

export const articlesSearchSchema = tablePageSearchSchema.extend({
  q: z.string().optional().catch(undefined),
  published: z.enum(['yes', 'no']).optional().catch(undefined),
  /** The article open in the dialog: `new` for the create form, or an article id. */
  edit: z
    .union([z.literal('new'), z.uuid()])
    .optional()
    .catch(undefined),
});

export type ArticlesSearch = z.infer<typeof articlesSearchSchema>;

export function hasArticleFilters(search: ArticlesSearch): boolean {
  return Boolean(search.q || search.published);
}

/** Query params of the API list for the URL search of the screen. */
export function toArticleListParams(search: ArticlesSearch): ArticleListParams {
  return {
    page: search.page ?? 1,
    pageSize: search.pageSize ?? DEFAULT_TABLE_PAGE_SIZE,
    q: search.q?.trim() || undefined,
    isPublished: search.published ? search.published === 'yes' : undefined,
  };
}
