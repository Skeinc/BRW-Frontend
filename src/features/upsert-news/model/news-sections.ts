export const NEWS_ITEM_SECTIONS = ['content', 'photos', 'publication'] as const;

export type NewsItemSection = (typeof NEWS_ITEM_SECTIONS)[number];

/** Which section each form field lives in, to mark sections with errors and to jump to the first one that has an error. */
export const NEWS_ITEM_SECTION_FIELDS: Readonly<Record<NewsItemSection, readonly string[]>> = {
  content: ['title', 'excerpt', 'content'],
  photos: [],
  publication: ['isPublished', 'publishedAt', 'seoTitle', 'seoDescription'],
};
