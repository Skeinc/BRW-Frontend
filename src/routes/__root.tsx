import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { readServerRuntimeConfig } from '@/shared/config';
import { i18n } from '@/shared/i18n';
import appCss from '@/app/styles/index.css?url';
import { SiteFooter } from '@/widgets/site-footer';
import { SiteHeader } from '@/widgets/site-header';

const loadRuntimeConfig = createServerFn({ method: 'GET' }).handler(() => readServerRuntimeConfig());

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  loader: () => loadRuntimeConfig(),
  head: ({ loaderData }) => ({
    meta: [
      { charSet: 'utf-8' },
      { title: i18n.t('app.name') },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#d92d3e' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
    scripts: loaderData
      ? [{ children: `window.BRW_CONFIG=${JSON.stringify(loaderData).replace(/</g, '\\u003c')}` }]
      : [],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang={i18n.language}>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
        <Scripts />
      </body>
    </html>
  );
}
