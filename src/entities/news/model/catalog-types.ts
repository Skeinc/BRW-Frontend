export interface CatalogNewsCoverImage {
  url: string;
  thumbUrl: string;
  alt: string | null;
  width: number;
  height: number;
}

/** One card of the storefront news item list; `publishedAt` is an ISO timestamp. */
export interface CatalogNewsCard {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  isPromo: boolean;
  publishedAt: string | null;
  coverImage: CatalogNewsCoverImage | null;
}

export interface CatalogNewsImage {
  id: string;
  url: string;
  thumbUrl: string;
  alt: string | null;
  sortOrder: number;
  width: number;
  height: number;
}

/** A published news item with its body text (Markdown or HTML) and photos. */
export interface CatalogNewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  isPromo: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  updatedAt: string;
  images: CatalogNewsImage[];
}

export interface CatalogNewsParams {
  page?: number;
  pageSize?: number;
  /** `true` for promotions only, `false` for plain news only; omitted for both. */
  isPromo?: boolean;
}
