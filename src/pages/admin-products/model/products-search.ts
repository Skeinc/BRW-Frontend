import { z } from 'zod';
import { PRODUCT_ISSUES, type ProductListParams } from '@/entities/product';
import { DEFAULT_TABLE_PAGE_SIZE, tablePageSearchSchema } from '@/shared/lib/table-search';

export const productsSearchSchema = tablePageSearchSchema.extend({
  q: z.string().optional().catch(undefined),
  categoryId: z.uuid().optional().catch(undefined),
  collectionId: z.uuid().optional().catch(undefined),
  published: z.enum(['yes', 'no']).optional().catch(undefined),
  issue: z.enum(PRODUCT_ISSUES).optional().catch(undefined),
  /** The product open in the dialog: `new` for the create form, or a product id. */
  edit: z
    .union([z.literal('new'), z.uuid()])
    .optional()
    .catch(undefined),
});

export type ProductsSearch = z.infer<typeof productsSearchSchema>;

export function hasProductFilters(search: ProductsSearch): boolean {
  return Boolean(search.q || search.categoryId || search.collectionId || search.published || search.issue);
}

/** Query params of the API list for the URL search of the screen. */
export function toProductListParams(search: ProductsSearch): ProductListParams {
  return {
    page: search.page ?? 1,
    pageSize: search.pageSize ?? DEFAULT_TABLE_PAGE_SIZE,
    q: search.q?.trim() || undefined,
    categoryId: search.categoryId,
    collectionId: search.collectionId,
    isPublished: search.published ? search.published === 'yes' : undefined,
    issue: search.issue,
  };
}
