import { z } from 'zod';
import type { RoomListParams } from '@/entities/room';
import { DEFAULT_TABLE_PAGE_SIZE, tablePageSearchSchema } from '@/shared/lib/table-search';

export const roomsSearchSchema = tablePageSearchSchema.extend({
  q: z.string().optional().catch(undefined),
  published: z.enum(['yes', 'no']).optional().catch(undefined),
  /** A room id to open in the edit form on arrival, for links from other screens. */
  edit: z.uuid().optional().catch(undefined),
});

export type RoomsSearch = z.infer<typeof roomsSearchSchema>;

export function hasRoomFilters(search: RoomsSearch): boolean {
  return Boolean(search.q || search.published);
}

/** Query params of the API list for the URL search of the screen. */
export function toRoomListParams(search: RoomsSearch): RoomListParams {
  return {
    page: search.page ?? 1,
    pageSize: search.pageSize ?? DEFAULT_TABLE_PAGE_SIZE,
    q: search.q?.trim() || undefined,
    isPublished: search.published ? search.published === 'yes' : undefined,
  };
}
