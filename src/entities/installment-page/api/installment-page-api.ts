import { apiRequest } from '@/shared/api';
import type { InstallmentPageContent, InstallmentPageResponse } from '../model/types';

export function fetchInstallmentPage(): Promise<InstallmentPageResponse> {
  return apiRequest<InstallmentPageResponse>('/installment-page');
}

export function fetchAdminInstallmentPage(): Promise<InstallmentPageResponse> {
  return apiRequest<InstallmentPageResponse>('/admin/installment-page');
}

export function saveInstallmentPage(content: InstallmentPageContent): Promise<InstallmentPageResponse> {
  return apiRequest<InstallmentPageResponse>('/admin/installment-page', {
    method: 'PUT',
    body: JSON.stringify(content),
  });
}
