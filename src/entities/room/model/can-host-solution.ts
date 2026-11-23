import type { RoomOption } from './types';

/** A solution of a collection can only be made in a room that sells solutions and shows that collection. */
export function canHostSolution(room: RoomOption, collectionId: string): boolean {
  return !room.isConsultationOnly && room.collectionIds.includes(collectionId);
}
