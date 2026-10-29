/** A published collection in the storefront list. */
export interface CatalogCollection {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  productCount: number;
}

/** A published collection with its texts and breadcrumbs (the collection itself). */
export interface CatalogCollectionDetail extends CatalogCollection {
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  breadcrumbs: { id: string; slug: string; name: string }[];
}
