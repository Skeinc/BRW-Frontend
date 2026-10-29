export interface CatalogRoomImage {
  url: string;
  thumbUrl: string;
  alt: string | null;
  width: number;
  height: number;
}

/** A room card of the home page. */
export interface CatalogRoomItem {
  id: string;
  name: string;
  imageUrl: string | null;
  collectionCount: number;
}

/** A collection card inside a room; the photo is the first solution picture of the collection in that room. */
export interface CatalogRoomCollection {
  id: string;
  name: string;
  imageUrl: string | null;
  solutionCount: number;
}

export interface CatalogRoomDetail extends CatalogRoomItem {
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  collections: CatalogRoomCollection[];
}

/** An element product of a ready-made solution. */
export interface CatalogSolutionProduct {
  id: string;
  name: string;
  price: string;
  oldPrice: string | null;
  image: CatalogRoomImage | null;
}

export interface CatalogSolution {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  images: CatalogRoomImage[];
  products: CatalogSolutionProduct[];
}

/** A collection inside a room: its text and the ready-made solutions of that room. */
export interface CatalogRoomCollectionDetail {
  room: { id: string; name: string };
  collection: {
    id: string;
    name: string;
    description: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
  };
  solutions: CatalogSolution[];
}
