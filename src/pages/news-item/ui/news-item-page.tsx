import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NewsCard, catalogNewsItemQueryOptions, catalogNewsQueryOptions } from '@/entities/news';
import { formatDate } from '@/shared/lib/format-date';
import { BreadcrumbTrail } from '@/shared/ui/breadcrumb-trail';
import { MarkdownContent } from '@/shared/ui/markdown-content';
import { RELATED_NEWS_COUNT, RELATED_NEWS_PARAMS } from '../model/related-news';

const route = getRouteApi('/news/$newsId');

export function NewsItemPage() {
  const { t, i18n } = useTranslation();
  const { newsId } = route.useParams();
  const { data: newsItem } = useSuspenseQuery(catalogNewsItemQueryOptions(newsId));
  const { data: latest } = useQuery(catalogNewsQueryOptions(RELATED_NEWS_PARAMS));
  const related = (latest?.items ?? []).filter((item) => item.id !== newsItem.id).slice(0, RELATED_NEWS_COUNT);
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <BreadcrumbTrail steps={[{ label: t('nav.news'), to: 'news' }, { label: newsItem.title }]} />
      <article>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{newsItem.title}</h1>
        {newsItem.publishedAt && (
          <time dateTime={newsItem.publishedAt} className="mt-3 block text-sm text-muted-foreground">
            {formatDate(newsItem.publishedAt, i18n.language)}
          </time>
        )}
        <div className="mt-6">
          <MarkdownContent content={newsItem.content} demoteHeadings />
        </div>
      </article>
      {related.length > 0 && (
        <section aria-labelledby="related-news" className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <h2 id="related-news" className="text-2xl font-bold tracking-tight md:text-3xl">
              {t('pages.newsItem.related')}
            </h2>
            <Link to="/news" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:text-primary">
              {t('pages.newsItem.all')}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.id}>
                <NewsCard newsItem={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
