export type SeoEntityType = 'category' | 'collection' | 'product';

/** A published page for the sitemap. `updatedAt` is an ISO date string. */
export interface SeoUrl {
  id: string;
  slug: string;
  updatedAt: string;
}

export interface SeoUrls {
  categories: SeoUrl[];
  collections: SeoUrl[];
  products: SeoUrl[];
  articles: SeoUrl[];
}

/** Current location of an entity that was requested by an old slug. */
export interface ResolvedSlug {
  type: SeoEntityType;
  id: string;
  slug: string;
}
