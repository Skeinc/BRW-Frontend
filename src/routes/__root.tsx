import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, HeadContent, Outlet, Scripts, useRouterState } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { useEffect } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { catalogCategoriesQueryOptions } from '@/entities/category';
import { catalogCollectionsQueryOptions } from '@/entities/collection';
import { catalogRoomsQueryOptions } from '@/entities/room';
import { buildPageLoaderCss, PAGE_LOADER_SCRIPT } from '@/app/page-loader';
import appCss from '@/app/styles/index.css?url';
import cyrillicFont from '@fontsource-variable/inter/files/inter-cyrillic-wght-normal.woff2?url';
import latinFont from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url';
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
    // The header menu and the footer list categories, collections and rooms; a failed request only leaves them empty.
    const [config] = await Promise.all([
      loadRuntimeConfig(),
      context.queryClient.ensureQueryData(catalogCategoriesQueryOptions).catch(() => undefined),
      context.queryClient.ensureQueryData(catalogCollectionsQueryOptions).catch(() => undefined),
      context.queryClient.ensureQueryData(catalogRoomsQueryOptions).catch(() => undefined),
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
      { rel: 'preload', href: latinFont, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { rel: 'preload', href: cyrillicFont, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      ...(loaderData ? [{ rel: 'preconnect', href: loaderData.config.publicApiUrl }] : []),
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { rel: 'icon', href: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
    ],
    styles: [{ children: buildPageLoaderCss(translate(loaderData?.language ?? 'ru', 'ui.loading')) }],
    scripts: [
      { children: PAGE_LOADER_SCRIPT },
      ...(loaderData
        ? [{ children: `window.BRW_CONFIG=${JSON.stringify(loaderData.config).replace(/</g, '\\u003c')}` }]
        : []),
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  const { language } = Route.useLoaderData();
  useEffect(() => {
    window.brwAppReady?.();
  }, []);
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
          <TooltipProvider>{isAdmin ? <Outlet /> : <StorefrontShell />}</TooltipProvider>
        </I18nextProvider>
        <Scripts />
      </body>
    </html>
  );
}

function StorefrontShell() {
  const { t } = useTranslation();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg"
      >
        {t('common.skipToContent')}
      </a>
      <AppHeader />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <AppFooter />
      <CookieConsent />
    </>
  );
}

declare global {
  interface Window {
    brwAppReady?: () => void;
  }
}
