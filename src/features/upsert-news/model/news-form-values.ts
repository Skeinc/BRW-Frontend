import type { NewsItem, NewsItemInput } from '@/entities/news';
import { fromDateTimeLocalValue, toDateTimeLocalValue } from '@/shared/lib/datetime-local';
import { emptyToNull } from '@/shared/lib/form/empty-to-null';
import type { NewsItemFormValues } from './news-form-schema';

/** A new news item is published right now by default, so its date starts as the current time. */
export function toDefaultValues(newsItem: NewsItem | null): NewsItemFormValues {
  return {
    title: newsItem?.title ?? '',
    excerpt: newsItem?.excerpt ?? '',
    content: newsItem?.content ?? '',
    isPublished: newsItem?.isPublished ?? true,
    isPromo: newsItem?.isPromo ?? false,
    publishedAt: toDateTimeLocalValue(newsItem ? newsItem.publishedAt : new Date().toISOString()),
    seoTitle: newsItem?.seoTitle ?? '',
    seoDescription: newsItem?.seoDescription ?? '',
  };
}

/** The address (slug) is not asked from the user: the API builds it from the title. */
export function toInput(values: NewsItemFormValues, newsItem: NewsItem | null): NewsItemInput {
  const isDateUntouched = newsItem !== null && values.publishedAt === toDateTimeLocalValue(newsItem.publishedAt);
  return {
    title: values.title.trim(),
    excerpt: emptyToNull(values.excerpt),
    content: values.content,
    isPublished: values.isPublished,
    isPromo: values.isPromo,
    publishedAt: isDateUntouched ? undefined : fromDateTimeLocalValue(values.publishedAt),
    seoTitle: emptyToNull(values.seoTitle),
    seoDescription: emptyToNull(values.seoDescription),
  };
}
