import { getRuntimeConfig, SITE_NAME } from '@/shared/config';
import type { CatalogNewsItem } from '../model/catalog-types';

/** schema.org `NewsArticle`: headline, dates, cover and publisher. */
export function buildNewsItemJsonLd(newsItem: CatalogNewsItem, path: string): Record<string, unknown> {
  const siteUrl = getRuntimeConfig().siteUrl.replace(/\/$/, '');
  const cover = newsItem.images[0];
  return {
    '@type': 'NewsArticle',
    headline: newsItem.title,
    description: newsItem.seoDescription ?? newsItem.excerpt ?? undefined,
    image: cover ? [new URL(cover.url, `${siteUrl}/`).href] : undefined,
    datePublished: newsItem.publishedAt ?? undefined,
    dateModified: newsItem.updatedAt,
    mainEntityOfPage: `${siteUrl}${path}`,
    publisher: { '@type': 'Organization', name: SITE_NAME },
  };
}
