export const PRODUCT_SECTIONS = ['main', 'pricing', 'details', 'attributes', 'photos', 'publication'] as const;

export type ProductSection = (typeof PRODUCT_SECTIONS)[number];

/** Which section each form field lives in, to mark sections with errors and to jump to the first one that has an error. */
export const PRODUCT_SECTION_FIELDS: Readonly<Record<ProductSection, readonly string[]>> = {
  main: ['name', 'categoryId', 'collectionId', 'sku', 'description'],
  pricing: ['price', 'oldPrice', 'stockStatus'],
  details: ['widthMm', 'heightMm', 'heightMaxMm', 'depthMm', 'lengthMm', 'material', 'colorBody', 'colorFacade'],
  attributes: ['attributes'],
  photos: [],
  publication: ['isPublished', 'isHit', 'seoTitle', 'seoDescription'],
};

/** Common specifications offered as one-click suggestions. */
export const ATTRIBUTE_SUGGESTIONS = [
  'Количество ящиков',
  'Количество дверей',
  'Тип механизма',
  'Страна производства',
  'Гарантия',
  'Вес',
] as const;
