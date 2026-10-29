import { apiRequest, toQueryString, type Paginated } from '@/shared/api';
import type { Solution, SolutionDetail, SolutionInput, SolutionListParams } from '../model/types';

export function fetchSolutionsPage(params: SolutionListParams): Promise<Paginated<Solution>> {
  return apiRequest<Paginated<Solution>>(`/admin/solutions${toQueryString({ ...params })}`);
}

export function fetchSolution(id: string): Promise<SolutionDetail> {
  return apiRequest<SolutionDetail>(`/admin/solutions/${id}`);
}

export function createSolution(input: SolutionInput): Promise<SolutionDetail> {
  return apiRequest<SolutionDetail>('/admin/solutions', { method: 'POST', body: JSON.stringify(input) });
}

export function updateSolution(id: string, input: Partial<SolutionInput>): Promise<SolutionDetail> {
  return apiRequest<SolutionDetail>(`/admin/solutions/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
}

export function deleteSolution(id: string): Promise<void> {
  return apiRequest<void>(`/admin/solutions/${id}`, { method: 'DELETE' });
}
