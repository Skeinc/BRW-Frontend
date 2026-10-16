import type { MediaCover, MediaImage } from '@/entities/media';

export type StockStatus = 'in_stock' | 'on_order' | 'out_of_stock';

export const STOCK_STATUSES: readonly StockStatus[] = ['in_stock', 'on_order', 'out_of_stock'];

/** One row of the product list. Prices are strings such as `"1299.00"`. */
export interface ProductListItem {
  id: string;
  slug: string;
  sku: string | null;
  name: string;
  price: string;
  oldPrice: string | null;
  stockStatus: StockStatus;
  isPublished: boolean;
  categoryId: string;
  categoryName: string;
  collectionId: string | null;
  collectionName: string | null;
  cover: MediaCover | null;
}

export interface Product {
  id: string;
  categoryId: string;
  collectionId: string | null;
  slug: string;
  sku: string | null;
  name: string;
  description: string | null;
  price: string;
  oldPrice: string | null;
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
  isPublished: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  images: MediaImage[];
}

export interface ProductInput {
  categoryId: string;
  collectionId: string | null;
  name: string;
  sku: string | null;
  description: string | null;
  price: string;
  oldPrice: string | null;
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
  isPublished: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
}

export interface ProductListParams {
  page: number;
  pageSize: number;
  q?: string;
  categoryId?: string;
  collectionId?: string;
  isPublished?: boolean;
}
