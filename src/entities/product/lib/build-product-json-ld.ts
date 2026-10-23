import { getRuntimeConfig, SITE_CURRENCY } from '@/shared/config';
import type { CatalogProductDetail } from '../model/catalog-types';
import type { StockStatus } from '../model/types';

const AVAILABILITY: Record<StockStatus, string> = {
  in_stock: 'https://schema.org/InStock',
  on_order: 'https://schema.org/PreOrder',
  out_of_stock: 'https://schema.org/OutOfStock',
};

/** schema.org `Product` with an `Offer` (price, currency, availability). */
export function buildProductJsonLd(product: CatalogProductDetail, path: string): Record<string, unknown> {
  const siteUrl = getRuntimeConfig().siteUrl.replace(/\/$/, '');
  return {
    '@type': 'Product',
    name: product.name,
    sku: product.sku ?? undefined,
    description: product.description ?? undefined,
    image:
      product.images.length > 0 ? product.images.map((image) => new URL(image.url, `${siteUrl}/`).href) : undefined,
    category: product.category.name,
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}${path}`,
      price: product.price,
      priceCurrency: SITE_CURRENCY,
      availability: AVAILABILITY[product.stockStatus],
    },
  };
}
