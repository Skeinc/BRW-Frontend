import type { StockStatus } from './types';

export interface CatalogRef {
  id: string;
  slug: string;
  name: string;
}

export interface CatalogCoverImage {
  url: string;
  thumbUrl: string;
  alt: string | null;
  width: number;
  height: number;
}

/** One product card of the storefront list. Prices are strings such as `"1299.00"`. */
export interface CatalogProductCard {
  id: string;
  slug: string;
  name: string;
  sku: string | null;
  price: string;
  oldPrice: string | null;
  discountPercent: number | null;
  isHit: boolean;
  stockStatus: StockStatus;
  coverImage: CatalogCoverImage | null;
  category: CatalogRef;
  collection: CatalogRef | null;
}

export type CatalogProductSort = 'price_asc' | 'price_desc' | 'new' | 'popular';

export interface CatalogProductsParams {
  sort?: CatalogProductSort;
  category?: string;
  /** Only the products marked as bestsellers in the admin panel. */
  hit?: boolean;
  page?: number;
  pageSize?: number;
}
