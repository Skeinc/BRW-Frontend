import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, HeadContent, Outlet, Scripts, useRouterState } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { I18nextProvider } from 'react-i18next';
import { catalogCategoriesQueryOptions } from '@/entities/category';
import appCss from '@/app/styles/index.css?url';
import { readServerRuntimeConfig } from '@/shared/config';
import { getI18n, readLanguage, translate } from '@/shared/i18n';
import { TooltipProvider } from '@/shared/ui/tooltip';
import { CookieConsent } from '@/features/cookie-consent';
import { AppFooter } from '@/widgets/app-footer';
import { AppHeader } from '@/widgets/app-header';

const loadRuntimeConfig = createServerFn({ method: 'GET' }).handler(() => readServerRuntimeConfig());

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  staleTime: Number.POSITIVE_INFINITY,
  loader: async ({ context }) => {
    // The footer lists the categories; a failed request only leaves that column empty.
    const [config] = await Promise.all([
      loadRuntimeConfig(),
      context.queryClient.ensureQueryData(catalogCategoriesQueryOptions).catch(() => undefined),
    ]);
    return { config, language: readLanguage() };
  },
  head: ({ loaderData }) => ({
    meta: [
      { charSet: 'utf-8' },
      { title: translate(loaderData?.language ?? 'ru', 'app.name') },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#d92d3e' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { rel: 'icon', href: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
    ],
    scripts: loaderData
      ? [{ children: `window.BRW_CONFIG=${JSON.stringify(loaderData.config).replace(/</g, '\\u003c')}` }]
      : [],
  }),
  component: RootComponent,
});

function RootComponent() {
  const { language } = Route.useLoaderData();
  const isAdmin = useRouterState({
    select: (state) => state.location.pathname === '/admin' || state.location.pathname.startsWith('/admin/'),
  });
  return (
    <html lang={language}>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col">
        <I18nextProvider i18n={getI18n(language)}>
          {isAdmin ? (
            <Outlet />
          ) : (
            <TooltipProvider>
              <AppHeader />
              <main className="flex-1">
                <Outlet />
              </main>
              <AppFooter />
              <CookieConsent />
            </TooltipProvider>
          )}
        </I18nextProvider>
        <Scripts />
      </body>
    </html>
  );
}
