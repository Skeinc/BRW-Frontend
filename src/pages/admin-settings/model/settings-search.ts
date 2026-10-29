import { z } from 'zod';
import type { SlideListParams } from '@/entities/slide';
import { tablePageSearchSchema } from '@/shared/lib/table-search';

/** Slides are few and shown as one list, so a page holds 100 rows by default. */
const SLIDES_DEFAULT_PAGE_SIZE = 100;

export const settingsSearchSchema = tablePageSearchSchema.extend({
  tab: z.enum(['slider']).optional().catch(undefined),
  /** A slide id to open in the edit form on arrival, for links from other screens. */
  edit: z.uuid().optional().catch(undefined),
});

export type SettingsSearch = z.infer<typeof settingsSearchSchema>;

/** Query params of the API list for the URL search of the screen. */
export function toSlideListParams(search: SettingsSearch): SlideListParams {
  return { page: search.page ?? 1, pageSize: search.pageSize ?? SLIDES_DEFAULT_PAGE_SIZE };
}
