import { apiRequest, toQueryString, type Paginated } from '@/shared/api';
import type { Category, CategoryDetail, CategoryInput, CategoryListParams } from '../model/types';

export function fetchCategoriesPage(params: CategoryListParams): Promise<Paginated<Category>> {
  return apiRequest<Paginated<Category>>(`/admin/categories${toQueryString({ ...params })}`);
}

/** Every category, not paged: for pickers that need the whole tree. */
export function fetchCategoryTree(): Promise<Category[]> {
  return apiRequest<Category[]>('/admin/categories/tree');
}

export function createCategory(input: CategoryInput): Promise<CategoryDetail> {
  return apiRequest<CategoryDetail>('/admin/categories', { method: 'POST', body: JSON.stringify(input) });
}

export function updateCategory(id: string, input: Partial<CategoryInput>): Promise<CategoryDetail> {
  return apiRequest<CategoryDetail>(`/admin/categories/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
}

/** Puts a category where a sibling is now; the API renumbers the siblings. */
export function moveCategory(id: string, overId: string): Promise<void> {
  return apiRequest<void>(`/admin/categories/${id}/move`, { method: 'PATCH', body: JSON.stringify({ overId }) });
}

export function deleteCategory(id: string): Promise<void> {
  return apiRequest<void>(`/admin/categories/${id}`, { method: 'DELETE' });
}
