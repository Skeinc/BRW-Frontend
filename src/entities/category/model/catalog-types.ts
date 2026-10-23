/** A published category in the storefront tree. `productCount` includes the products of every subcategory. */
export interface CatalogCategory {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  productCount: number;
  children: CatalogCategory[];
}

export interface CatalogBreadcrumb {
  id: string;
  slug: string;
  name: string;
}

/** A published category with its subtree, texts and the path from the root. */
export interface CatalogCategoryDetail extends CatalogCategory {
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  breadcrumbs: CatalogBreadcrumb[];
}
