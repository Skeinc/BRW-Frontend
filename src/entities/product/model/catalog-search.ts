import { z } from 'zod';
import type { CatalogProductFilters, CatalogProductSort, CatalogProductsParams } from './catalog-types';

export const CATALOG_PAGE_SIZE = 24;

export const CATALOG_SORTS: readonly CatalogProductSort[] = ['popular', 'new', 'price_asc', 'price_desc'];

const PRICE_PATTERN = /^\d+(\.\d{1,2})?$/;
const price = z.string().regex(PRICE_PATTERN).optional().catch(undefined);
const values = z.array(z.string()).optional().catch(undefined);

/** URL search params of every product list: category, collection and search pages. */
export const catalogSearchSchema = z.object({
  page: z.coerce.number().int().min(1).optional().catch(undefined),
  sort: z.enum(['popular', 'new', 'price_asc', 'price_desc']).optional().catch(undefined),
  q: z.coerce.string().optional().catch(undefined),
  collection: z.string().optional().catch(undefined),
  priceMin: price,
  priceMax: price,
  material: values,
  colorBody: values,
  colorFacade: values,
  inStock: z.boolean().optional().catch(undefined),
});

export type CatalogSearch = z.infer<typeof catalogSearchSchema>;

type FilterKey = Exclude<keyof CatalogSearch, 'page' | 'sort' | 'q'>;

const FILTER_KEYS: readonly FilterKey[] = [
  'collection',
  'priceMin',
  'priceMax',
  'material',
  'colorBody',
  'colorFacade',
  'inStock',
];

function nonEmpty(list: readonly string[] | undefined): readonly string[] | undefined {
  return list && list.length > 0 ? list : undefined;
}

/** The filters of the list that the facets also take. A page can pin `category` or `collection` by its slug. */
export function toCatalogFilters(search: CatalogSearch, pinned: CatalogProductFilters = {}): CatalogProductFilters {
  return {
    ...pinned,
    q: search.q || undefined,
    collection: pinned.collection ?? search.collection,
    priceMin: search.priceMin,
    priceMax: search.priceMax,
    material: nonEmpty(search.material),
    colorBody: nonEmpty(search.colorBody),
    colorFacade: nonEmpty(search.colorFacade),
    inStock: search.inStock ? true : undefined,
  };
}

export function toCatalogParams(search: CatalogSearch, pinned: CatalogProductFilters = {}): CatalogProductsParams {
  return {
    ...toCatalogFilters(search, pinned),
    sort: search.sort,
    page: search.page,
    pageSize: CATALOG_PAGE_SIZE,
  };
}

export function countActiveFilters(search: CatalogSearch): number {
  return FILTER_KEYS.filter((key) => {
    const value = search[key];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  }).length;
}

/** `true` when the URL carries anything besides the page number that changes the list. */
export function hasCatalogVariation(search: CatalogSearch): boolean {
  return countActiveFilters(search) > 0 || search.sort !== undefined;
}

/** Search params with every filter cleared; the query and the sort stay. */
export function clearCatalogFilters(search: CatalogSearch): CatalogSearch {
  return { q: search.q, sort: search.sort };
}
