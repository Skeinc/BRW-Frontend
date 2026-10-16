import { lazy } from 'react';

export { productsSearchSchema } from './model/products-search';

/**
 * The screen loads on demand: a route imports the search schema from this file, and a plain re-export of the page
 * would pull the whole screen into the main bundle together with it.
 */
export const AdminProductsPage = lazy(() =>
  import('./ui/admin-products-page').then((module) => ({ default: module.AdminProductsPage })),
);
