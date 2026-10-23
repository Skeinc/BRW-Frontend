import { getRuntimeConfig, SITE_NAME } from '@/shared/config';
import type { CatalogArticle } from '../model/catalog-types';

/** schema.org `Article`: headline, dates, cover and publisher. */
export function buildArticleJsonLd(article: CatalogArticle, path: string): Record<string, unknown> {
  const siteUrl = getRuntimeConfig().siteUrl.replace(/\/$/, '');
  const cover = article.images[0];
  return {
    '@type': 'Article',
    headline: article.title,
    description: article.seoDescription ?? article.excerpt ?? undefined,
    image: cover ? [new URL(cover.url, `${siteUrl}/`).href] : undefined,
    datePublished: article.publishedAt ?? undefined,
    dateModified: article.updatedAt,
    mainEntityOfPage: `${siteUrl}${path}`,
    publisher: { '@type': 'Organization', name: SITE_NAME },
  };
}
