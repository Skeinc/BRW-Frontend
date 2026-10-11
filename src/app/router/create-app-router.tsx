import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { createQueryClient } from '@/app/query-client';
import { routeTree } from '@/routeTree.gen';
import '@/shared/i18n';
import { RouterErrorFallback } from './router-error-fallback';
import { RouterNotFound } from './router-not-found';

/** Builds a router per request (SSR) or once in the browser. */
export function createAppRouter() {
  const queryClient = createQueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultErrorComponent: RouterErrorFallback,
    defaultNotFoundComponent: RouterNotFound,
  });
  setupRouterSsrQueryIntegration({ router, queryClient });
  return router;
}
