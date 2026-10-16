import { z } from 'zod';

export const TABLE_PAGE_SIZES = [25, 50, 100] as const;
export const DEFAULT_TABLE_PAGE_SIZE = 25;

/** Page and page size in the URL of a table screen; both are optional and default to page 1 and 25 rows. */
export const tablePageSearchSchema = z.object({
  page: z.coerce.number().int().min(1).optional().catch(undefined),
  pageSize: z.coerce
    .number()
    .refine((value) => (TABLE_PAGE_SIZES as readonly number[]).includes(value))
    .optional()
    .catch(undefined),
});
