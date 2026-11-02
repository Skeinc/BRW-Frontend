import type { CatalogProductsParams } from './catalog-types';

const HOME_SHOWCASE_SIZE = 8;

export const NEW_ARRIVALS_PARAMS: CatalogProductsParams = { sort: 'new', pageSize: HOME_SHOWCASE_SIZE };

export const POPULAR_PARAMS: CatalogProductsParams = { sort: 'popular', pageSize: HOME_SHOWCASE_SIZE };

const RELATED_PRODUCTS_SIZE = 9;

/** Other products of the same collection, or of the same category when the product has no collection. */
export function getRelatedProductsParams(product: {
  category: { slug: string };
  collection: { slug: string } | null;
}): CatalogProductsParams {
  return product.collection
    ? { collection: product.collection.slug, pageSize: RELATED_PRODUCTS_SIZE }
    : { category: product.category.slug, pageSize: RELATED_PRODUCTS_SIZE };
}
