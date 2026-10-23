import { getRuntimeConfig, SITE_CURRENCY, SITE_NAME } from '@/shared/config';
import type { CatalogProductDetail } from '../model/catalog-types';
import type { StockStatus } from '../model/types';

const AVAILABILITY: Record<StockStatus, string> = {
  in_stock: 'https://schema.org/InStock',
  on_order: 'https://schema.org/PreOrder',
  out_of_stock: 'https://schema.org/OutOfStock',
};

const MAX_DESCRIPTION_LENGTH = 5000;

/** Drops markdown markup so structured data carries plain text. */
function toPlainText(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '')
    .replace(/[*_`~]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_DESCRIPTION_LENGTH);
}

/** schema.org `Product` with an `Offer` (price, currency, availability). */
export function buildProductJsonLd(product: CatalogProductDetail, path: string): Record<string, unknown> {
  const siteUrl = getRuntimeConfig().siteUrl.replace(/\/$/, '');
  return {
    '@type': 'Product',
    name: product.name,
    sku: product.sku ?? undefined,
    brand: { '@type': 'Brand', name: SITE_NAME },
    description: product.description ? toPlainText(product.description) || undefined : undefined,
    image:
      product.images.length > 0 ? product.images.map((image) => new URL(image.url, `${siteUrl}/`).href) : undefined,
    category: product.category.name,
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}${path}`,
      price: product.price,
      priceCurrency: SITE_CURRENCY,
      availability: AVAILABILITY[product.stockStatus],
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
}
