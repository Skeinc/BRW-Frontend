import { lazy } from 'react';

export { analyticsSearchSchema } from './model/analytics-search';

/**
 * The screen loads on demand: a route imports the search schema from this file, and a plain re-export of the page
 * would pull the whole screen and the chart library into the main bundle together with it.
 */
export const AdminAnalyticsPage = lazy(() =>
  import('./ui/admin-analytics-page').then((module) => ({ default: module.AdminAnalyticsPage })),
);
