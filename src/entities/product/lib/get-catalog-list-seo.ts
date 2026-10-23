import { hasCatalogVariation, type CatalogSearch } from '../model/catalog-search';

/**
 * Canonical path and robots for a product list. Filters and sort point to the clean URL and are `noindex`;
 * page 2 and later keep their own canonical with `?page=`.
 */
export function getCatalogListSeo(basePath: string, search: CatalogSearch): { path: string; isNoIndex: boolean } {
  if (hasCatalogVariation(search)) {
    return { path: basePath, isNoIndex: true };
  }
  const page = search.page ?? 1;
  return { path: page > 1 ? `${basePath}?page=${page}` : basePath, isNoIndex: false };
}
