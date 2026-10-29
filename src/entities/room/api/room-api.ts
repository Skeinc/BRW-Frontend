import { apiRequest, toQueryString, type Paginated } from '@/shared/api';
import type { Room, RoomDetail, RoomInput, RoomListParams } from '../model/types';

export function fetchRoomsPage(params: RoomListParams): Promise<Paginated<Room>> {
  return apiRequest<Paginated<Room>>(`/admin/rooms${toQueryString({ ...params })}`);
}

export function createRoom(input: RoomInput): Promise<RoomDetail> {
  return apiRequest<RoomDetail>('/admin/rooms', { method: 'POST', body: JSON.stringify(input) });
}

export function updateRoom(id: string, input: Partial<RoomInput>): Promise<RoomDetail> {
  return apiRequest<RoomDetail>(`/admin/rooms/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
}

/** Puts a room where another one is now; the API renumbers the ones in between. */
export function moveRoom(id: string, overId: string): Promise<void> {
  return apiRequest<void>(`/admin/rooms/${id}/move`, { method: 'PATCH', body: JSON.stringify({ overId }) });
}

export function deleteRoom(id: string): Promise<void> {
  return apiRequest<void>(`/admin/rooms/${id}`, { method: 'DELETE' });
}
