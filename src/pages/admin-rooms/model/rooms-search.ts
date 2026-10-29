import { z } from 'zod';
import type { RoomListParams } from '@/entities/room';
import { DEFAULT_TABLE_PAGE_SIZE, tablePageSearchSchema } from '@/shared/lib/table-search';

export const roomsSearchSchema = tablePageSearchSchema.extend({
  /** A room id to open in the edit form on arrival, for links from other screens. */
  edit: z.uuid().optional().catch(undefined),
});

export type RoomsSearch = z.infer<typeof roomsSearchSchema>;

/** Query params of the API list for the URL search of the screen. */
export function toRoomListParams(search: RoomsSearch): RoomListParams {
  return {
    page: search.page ?? 1,
    pageSize: search.pageSize ?? DEFAULT_TABLE_PAGE_SIZE,
  };
}
