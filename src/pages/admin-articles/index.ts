import { lazy } from 'react';

export { articlesSearchSchema } from './model/articles-search';

/**
 * The screen loads on demand: a route imports the search schema from this file, and a plain re-export of the page
 * would pull the whole screen into the main bundle together with it.
 */
export const AdminArticlesPage = lazy(() =>
  import('./ui/admin-articles-page').then((module) => ({ default: module.AdminArticlesPage })),
);
