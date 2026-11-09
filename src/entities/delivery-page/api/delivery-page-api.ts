import { apiRequest } from '@/shared/api';
import type { DeliveryPageContent, DeliveryPageResponse } from '../model/types';

export function fetchDeliveryPage(): Promise<DeliveryPageResponse> {
  return apiRequest<DeliveryPageResponse>('/delivery-page');
}

export function fetchAdminDeliveryPage(): Promise<DeliveryPageResponse> {
  return apiRequest<DeliveryPageResponse>('/admin/delivery-page');
}

export function saveDeliveryPage(content: DeliveryPageContent): Promise<DeliveryPageResponse> {
  return apiRequest<DeliveryPageResponse>('/admin/delivery-page', { method: 'PUT', body: JSON.stringify(content) });
}
