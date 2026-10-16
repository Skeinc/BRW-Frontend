import { apiRequest } from '@/shared/api';

export interface AdminMe {
  email: string;
}

export interface AdminLoginInput {
  email: string;
  password: string;
}

export function fetchAdminMe(): Promise<AdminMe> {
  return apiRequest<AdminMe>('/admin/auth/me');
}

export function loginAdmin(input: AdminLoginInput): Promise<AdminMe> {
  return apiRequest<AdminMe>('/admin/auth/login', { method: 'POST', body: JSON.stringify(input) });
}

export function logoutAdmin(): Promise<void> {
  return apiRequest<void>('/admin/auth/logout', { method: 'POST' });
}
