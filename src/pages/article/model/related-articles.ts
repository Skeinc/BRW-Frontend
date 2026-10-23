export const RELATED_ARTICLES_COUNT = 3;

/** One more than shown, so the current article can be left out of the list. */
export const RELATED_ARTICLES_PARAMS = { pageSize: RELATED_ARTICLES_COUNT + 1 } as const;
