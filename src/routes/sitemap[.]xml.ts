import { createFileRoute } from '@tanstack/react-router';
import { buildSitemap, fetchSeoUrls } from '@/entities/seo';
import { readServerRuntimeConfig } from '@/shared/config';

const CACHE_SECONDS = 3600;

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const xml = buildSitemap(readServerRuntimeConfig().siteUrl, await fetchSeoUrls());
          return new Response(xml, {
            headers: {
              'Content-Type': 'application/xml; charset=utf-8',
              'Cache-Control': `public, max-age=${CACHE_SECONDS}`,
            },
          });
        } catch {
          return new Response('Sitemap is temporarily unavailable', {
            status: 503,
            headers: { 'Cache-Control': 'no-store' },
          });
        }
      },
    },
  },
});
