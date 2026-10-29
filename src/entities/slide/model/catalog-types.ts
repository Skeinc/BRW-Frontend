export interface CatalogSlide {
  id: string;
  alt: string;
  linkUrl: string | null;
  image: {
    url: string;
    thumbUrl: string;
    width: number;
    height: number;
  };
}
