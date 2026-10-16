export const ARTICLE_SECTIONS = ['content', 'photos', 'publication'] as const;

export type ArticleSection = (typeof ARTICLE_SECTIONS)[number];

/** Which section each form field lives in, to mark sections with errors and to jump to the first one that has an error. */
export const ARTICLE_SECTION_FIELDS: Readonly<Record<ArticleSection, readonly string[]>> = {
  content: ['title', 'excerpt', 'content'],
  photos: [],
  publication: ['isPublished', 'publishedAt', 'seoTitle', 'seoDescription'],
};
