import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { I18nextProvider } from 'react-i18next';
import appCss from '@/app/styles/index.css?url';
import { readServerRuntimeConfig } from '@/shared/config';
import { getI18n, readLanguage, translate } from '@/shared/i18n';
import { AppFooter } from '@/widgets/app-footer';
import { AppHeader } from '@/widgets/app-header';

const loadRuntimeConfig = createServerFn({ method: 'GET' }).handler(() => readServerRuntimeConfig());

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  staleTime: Number.POSITIVE_INFINITY,
  loader: async () => ({ config: await loadRuntimeConfig(), language: readLanguage() }),
  head: ({ loaderData }) => ({
    meta: [
      { charSet: 'utf-8' },
      { title: translate(loaderData?.language ?? 'ru', 'app.name') },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#d92d3e' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
    scripts: loaderData
      ? [{ children: `window.BRW_CONFIG=${JSON.stringify(loaderData.config).replace(/</g, '\\u003c')}` }]
      : [],
  }),
  component: RootComponent,
});

function RootComponent() {
  const { language } = Route.useLoaderData();
  return (
    <html lang={language}>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col">
        <I18nextProvider i18n={getI18n(language)}>
          <AppHeader />
          <main className="flex-1">
            <Outlet />
          </main>
          <AppFooter />
        </I18nextProvider>
        <Scripts />
      </body>
    </html>
  );
}
