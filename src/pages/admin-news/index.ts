import { lazy } from 'react';

export { newsSearchSchema } from './model/news-search';

/**
 * The screen loads on demand: a route imports the search schema from this file, and a plain re-export of the page
 * would pull the whole screen into the main bundle together with it.
 */
export const AdminNewsPage = lazy(() =>
  import('./ui/admin-news-page').then((module) => ({ default: module.AdminNewsPage })),
);
