import type { CatalogProductsParams } from './catalog-types';

const HOME_SHOWCASE_SIZE = 8;

export const NEW_ARRIVALS_PARAMS: CatalogProductsParams = { sort: 'new', pageSize: HOME_SHOWCASE_SIZE };

export const HITS_PARAMS: CatalogProductsParams = { hit: true, sort: 'popular', pageSize: HOME_SHOWCASE_SIZE };
