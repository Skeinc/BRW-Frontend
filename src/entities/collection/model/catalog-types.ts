/** A published collection with its texts and breadcrumbs (the collection itself). */
export interface CatalogCollectionDetail {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  productCount: number;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  breadcrumbs: { id: string; slug: string; name: string }[];
}
