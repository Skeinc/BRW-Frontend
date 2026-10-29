import { lazy } from 'react';

export { settingsSearchSchema } from './model/settings-search';

/**
 * The screen loads on demand: a route imports the search schema from this file, and a plain re-export of the page
 * would pull the whole screen into the main bundle together with it.
 */
export const AdminSettingsPage = lazy(() =>
  import('./ui/admin-settings-page').then((module) => ({ default: module.AdminSettingsPage })),
);
