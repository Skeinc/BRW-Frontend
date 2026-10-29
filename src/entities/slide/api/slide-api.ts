import { apiRequest, toQueryString, type Paginated } from '@/shared/api';
import type { Slide, SlideDetail, SlideInput, SlideListParams } from '../model/types';

export function fetchSlidesPage(params: SlideListParams): Promise<Paginated<Slide>> {
  return apiRequest<Paginated<Slide>>(`/admin/slides${toQueryString({ ...params })}`);
}

export function createSlide(input: SlideInput): Promise<SlideDetail> {
  return apiRequest<SlideDetail>('/admin/slides', { method: 'POST', body: JSON.stringify(input) });
}

export function updateSlide(id: string, input: Partial<SlideInput>): Promise<SlideDetail> {
  return apiRequest<SlideDetail>(`/admin/slides/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
}

/** Puts a slide where another one is now; the API renumbers the ones in between. */
export function moveSlide(id: string, overId: string): Promise<void> {
  return apiRequest<void>(`/admin/slides/${id}/move`, { method: 'PATCH', body: JSON.stringify({ overId }) });
}

export function deleteSlide(id: string): Promise<void> {
  return apiRequest<void>(`/admin/slides/${id}`, { method: 'DELETE' });
}
