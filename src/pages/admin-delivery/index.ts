import { lazy } from 'react';

/**
 * The screen loads on demand: a plain re-export of the page would pull it into the main bundle together with the
 * route file.
 */
export const AdminDeliveryPage = lazy(() =>
  import('./ui/admin-delivery-page').then((module) => ({ default: module.AdminDeliveryPage })),
);
