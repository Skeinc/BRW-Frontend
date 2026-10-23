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
  /** Category slug; includes the subcategories. */
  category?: string;
  /** Collection slug. */
  collection?: string;
  q?: string;
  priceMin?: string;
  priceMax?: string;
  material?: readonly string[];
  colorBody?: readonly string[];
  colorFacade?: readonly string[];
  inStock?: boolean;
  /** Only the products marked as bestsellers in the admin panel. */
  hit?: boolean;
  page?: number;
  pageSize?: number;
}

/** Filters shared by the product list and its facets. */
export type CatalogProductFilters = Omit<CatalogProductsParams, 'sort' | 'page' | 'pageSize'>;

export interface CatalogFacetValue {
  value: string;
  count: number;
}

export interface CatalogProductFacets {
  price: { min: string | null; max: string | null };
  collections: { slug: string; name: string; count: number }[];
  materials: CatalogFacetValue[];
  colorsBody: CatalogFacetValue[];
  colorsFacade: CatalogFacetValue[];
}

export interface CatalogProductImage {
  id: string;
  url: string;
  thumbUrl: string;
  alt: string | null;
  sortOrder: number;
  width: number;
  height: number;
}

/** A published product with its photos and the path from the root category. */
export interface CatalogProductDetail {
  id: string;
  slug: string;
  sku: string | null;
  name: string;
  description: string | null;
  price: string;
  oldPrice: string | null;
  discountPercent: number | null;
  stockStatus: StockStatus;
  widthMm: number | null;
  heightMm: number | null;
  heightMaxMm: number | null;
  depthMm: number | null;
  lengthMm: number | null;
  material: string | null;
  colorBody: string | null;
  colorFacade: string | null;
  attributes: Record<string, string>;
  isHit: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  images: CatalogProductImage[];
  category: CatalogRef;
  collection: CatalogRef | null;
  breadcrumbs: CatalogRef[];
}
