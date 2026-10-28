export const RELATED_NEWS_COUNT = 3;

/** One more than shown, so the current news item can be left out of the list. */
export const RELATED_NEWS_PARAMS = { pageSize: RELATED_NEWS_COUNT + 1 } as const;
