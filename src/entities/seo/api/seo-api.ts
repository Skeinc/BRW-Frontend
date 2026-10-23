import { ApiError, apiRequest } from '@/shared/api';
import type { ResolvedSlug, SeoEntityType, SeoUrls } from '../model/types';

export function fetchSeoUrls(): Promise<SeoUrls> {
  return apiRequest<SeoUrls>('/seo/urls');
}

/** The new location of a renamed slug, or `null` when the slug was never used. */
export async function fetchResolvedSlug(type: SeoEntityType, slug: string): Promise<ResolvedSlug | null> {
  try {
    return await apiRequest<ResolvedSlug>(`/seo/resolve?type=${type}&slug=${encodeURIComponent(slug)}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
