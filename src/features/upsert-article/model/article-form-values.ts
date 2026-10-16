import type { Article, ArticleInput } from '@/entities/article';
import { fromDateTimeLocalValue, toDateTimeLocalValue } from '@/shared/lib/datetime-local';
import { emptyToNull } from '@/shared/lib/form/empty-to-null';
import type { ArticleFormValues } from './article-form-schema';

/** A new article is published right now by default, so its date starts as the current time. */
export function toDefaultValues(article: Article | null): ArticleFormValues {
  return {
    title: article?.title ?? '',
    excerpt: article?.excerpt ?? '',
    content: article?.content ?? '',
    isPublished: article?.isPublished ?? true,
    publishedAt: toDateTimeLocalValue(article ? article.publishedAt : new Date().toISOString()),
    seoTitle: article?.seoTitle ?? '',
    seoDescription: article?.seoDescription ?? '',
  };
}

/** The address (slug) is not asked from the user: the API builds it from the title. */
export function toInput(values: ArticleFormValues, article: Article | null): ArticleInput {
  const isDateUntouched = article !== null && values.publishedAt === toDateTimeLocalValue(article.publishedAt);
  return {
    title: values.title.trim(),
    excerpt: emptyToNull(values.excerpt),
    content: values.content,
    isPublished: values.isPublished,
    publishedAt: isDateUntouched ? undefined : fromDateTimeLocalValue(values.publishedAt),
    seoTitle: emptyToNull(values.seoTitle),
    seoDescription: emptyToNull(values.seoDescription),
  };
}
