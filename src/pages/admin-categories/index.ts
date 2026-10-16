import { lazy } from 'react';

export { categoriesSearchSchema } from './model/categories-search';

/**
 * The screen loads on demand: a route imports the search schema from this file, and a plain re-export of the page
 * would pull the whole screen into the main bundle together with it.
 */
export const AdminCategoriesPage = lazy(() =>
  import('./ui/admin-categories-page').then((module) => ({ default: module.AdminCategoriesPage })),
);
