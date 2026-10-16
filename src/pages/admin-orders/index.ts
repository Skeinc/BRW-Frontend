import { lazy } from 'react';

export { ordersSearchSchema } from './model/orders-search';

/**
 * The screen loads on demand: a route imports the search schema from this file, and a plain re-export of the page
 * would pull the whole screen into the main bundle together with it.
 */
export const AdminOrdersPage = lazy(() =>
  import('./ui/admin-orders-page').then((module) => ({ default: module.AdminOrdersPage })),
);
