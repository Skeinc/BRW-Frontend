/** A published category in the storefront tree. `productCount` includes the products of every subcategory. */
export interface CatalogCategory {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  productCount: number;
  children: CatalogCategory[];
}
