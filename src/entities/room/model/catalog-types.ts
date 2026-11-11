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
  /** Kitchens: no solutions and no cart; the collection page shows photos, the text, `priceFrom` and the contacts. */
  isConsultationOnly: boolean;
  imageUrl: string | null;
  collectionCount: number;
}

/**
 * A collection card inside a room; the photo is the first solution picture of the collection in that room, or the
 * collection cover in a consultation-only room.
 */
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

/** A collection inside a room: its text, photos and the ready-made solutions of that room (none in a consultation-only room). */
export interface CatalogRoomCollectionDetail {
  room: { id: string; name: string; isConsultationOnly: boolean };
  collection: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    priceFrom: string | null;
    images: CatalogRoomImage[];
    seoTitle: string | null;
    seoDescription: string | null;
  };
  solutions: CatalogSolution[];
}

/** A solution of a collection in some room: a thumbnail that opens the collection page of that room. */
export interface CatalogCollectionSolution {
  id: string;
  name: string;
  roomId: string;
  roomName: string;
  image: CatalogRoomImage | null;
}
