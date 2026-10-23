import { createFileRoute } from '@tanstack/react-router';
import { readServerRuntimeConfig } from '@/shared/config';

const CACHE_SECONDS = 3600;

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () => {
        const siteUrl = readServerRuntimeConfig().siteUrl.replace(/\/$/, '');
        const body = [
          'User-agent: *',
          'Disallow: /admin',
          'Disallow: /api',
          '',
          `Sitemap: ${siteUrl}/sitemap.xml`,
          '',
        ].join('\n');
        return new Response(body, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': `public, max-age=${CACHE_SECONDS}`,
          },
        });
      },
    },
  },
});
