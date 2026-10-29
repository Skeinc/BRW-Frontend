import type { SeoUrls } from '../model/types';

const STATIC_PATHS = [
  '/',
  '/catalog',
  '/articles',
  '/news',
  '/about',
  '/delivery-and-payment',
  '/installment',
  '/faq',
  '/privacy',
] as const;

interface SitemapEntry {
  path: string;
  updatedAt?: string;
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

/** sitemap.xml for the static pages and every published category, collection, product, article and news item. */
export function buildSitemap(siteUrl: string, urls: SeoUrls): string {
  const origin = siteUrl.replace(/\/$/, '');
  const entries: SitemapEntry[] = [
    ...STATIC_PATHS.map((path) => ({ path })),
    ...urls.categories.map(({ id, updatedAt }) => ({ path: `/catalog/${id}`, updatedAt })),
    ...urls.collections.map(({ id, updatedAt }) => ({ path: `/collection/${id}`, updatedAt })),
    ...urls.products.map(({ id, updatedAt }) => ({ path: `/product/${id}`, updatedAt })),
    ...urls.articles.map(({ id, updatedAt }) => ({ path: `/articles/${id}`, updatedAt })),
    ...urls.news.map(({ id, updatedAt }) => ({ path: `/news/${id}`, updatedAt })),
  ];
  const items = entries.map(({ path, updatedAt }) => {
    const lastmod = updatedAt ? `<lastmod>${escapeXml(updatedAt)}</lastmod>` : '';
    return `<url><loc>${escapeXml(`${origin}${path}`)}</loc>${lastmod}</url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items.join('\n')}\n</urlset>\n`;
}
