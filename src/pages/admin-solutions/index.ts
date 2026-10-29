import { lazy } from 'react';

export { solutionsSearchSchema } from './model/solutions-search';

/**
 * The screen loads on demand: a route imports the search schema from this file, and a plain re-export of the page
 * would pull the whole screen into the main bundle together with it.
 */
export const AdminSolutionsPage = lazy(() =>
  import('./ui/admin-solutions-page').then((module) => ({ default: module.AdminSolutionsPage })),
);
