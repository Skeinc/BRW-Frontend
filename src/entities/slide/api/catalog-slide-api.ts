import { apiRequest } from '@/shared/api';
import type { CatalogSlide } from '../model/catalog-types';

/** Published slides of the home page, in display order. */
export function fetchCatalogSlides(): Promise<CatalogSlide[]> {
  return apiRequest<CatalogSlide[]>('/slides');
}
