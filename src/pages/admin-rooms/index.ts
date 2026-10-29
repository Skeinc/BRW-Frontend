import { lazy } from 'react';

export { roomsSearchSchema } from './model/rooms-search';

/**
 * The screen loads on demand: a route imports the search schema from this file, and a plain re-export of the page
 * would pull the whole screen into the main bundle together with it.
 */
export const AdminRoomsPage = lazy(() =>
  import('./ui/admin-rooms-page').then((module) => ({ default: module.AdminRoomsPage })),
);
