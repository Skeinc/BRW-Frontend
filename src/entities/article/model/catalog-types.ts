export interface CatalogArticleCoverImage {
  url: string;
  thumbUrl: string;
  alt: string | null;
  width: number;
  height: number;
}

/** One card of the storefront article list; `publishedAt` is an ISO timestamp. */
export interface CatalogArticleCard {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  coverImage: CatalogArticleCoverImage | null;
}

export interface CatalogArticleImage {
  id: string;
  url: string;
  thumbUrl: string;
  alt: string | null;
  sortOrder: number;
  width: number;
  height: number;
}

/** A published article with its body text (Markdown or HTML) and photos. */
export interface CatalogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  updatedAt: string;
  images: CatalogArticleImage[];
}

export interface CatalogArticlesParams {
  page?: number;
  pageSize?: number;
}
