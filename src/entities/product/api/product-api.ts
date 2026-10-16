import { apiRequest, toQueryString, type Paginated } from '@/shared/api';
import type { Product, ProductInput, ProductListItem, ProductListParams } from '../model/types';

export function fetchProductsPage(params: ProductListParams): Promise<Paginated<ProductListItem>> {
  return apiRequest<Paginated<ProductListItem>>(`/admin/products${toQueryString({ ...params })}`);
}

export function fetchProduct(id: string): Promise<Product> {
  return apiRequest<Product>(`/admin/products/${id}`);
}

export function createProduct(input: ProductInput): Promise<Product> {
  return apiRequest<Product>('/admin/products', { method: 'POST', body: JSON.stringify(input) });
}

export function updateProduct(id: string, input: ProductInput): Promise<Product> {
  return apiRequest<Product>(`/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
}

export function deleteProduct(id: string): Promise<void> {
  return apiRequest<void>(`/admin/products/${id}`, { method: 'DELETE' });
}
