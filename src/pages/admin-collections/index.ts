import { lazy } from 'react';

export { collectionsSearchSchema } from './model/collections-search';

/**
 * The screen loads on demand: a route imports the search schema from this file, and a plain re-export of the page
 * would pull the whole screen into the main bundle together with it.
 */
export const AdminCollectionsPage = lazy(() =>
  import('./ui/admin-collections-page').then((module) => ({ default: module.AdminCollectionsPage })),
);
