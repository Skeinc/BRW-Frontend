import { notFound } from '@tanstack/react-router';
import { ApiError } from '@/shared/api';
import { fetchResolvedSlug } from '../api/seo-api';
import type { SeoEntityType } from '../model/types';

const MISSING_STATUSES: readonly number[] = [400, 404];

/**
 * For a loader whose entity was not found by the URL parameter: if the parameter is an old slug, returns the id
 * to redirect to (301); otherwise throws the router 404. Errors other than "no such entity" pass through.
 */
export async function resolveRenamedSlug(type: SeoEntityType, param: string, error: unknown): Promise<string> {
  if (!(error instanceof ApiError) || !MISSING_STATUSES.includes(error.status)) {
    throw error;
  }
  const resolved = await fetchResolvedSlug(type, param);
  if (!resolved) {
    throw notFound();
  }
  return resolved.id;
}
