import { ErrorState } from '@/shared/ui/error-state';
import { useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { NewsCard, catalogNewsQueryOptions } from '@/entities/news';
import { BreadcrumbTrail } from '@/shared/ui/breadcrumb-trail';
import { PagePagination } from '@/shared/ui/page-pagination';
import { Skeleton } from '@/shared/ui/skeleton';
import { NEWS_PAGE_SIZE } from '../model/news-page-size';

const route = getRouteApi('/news/');

const SKELETON_KEYS = Array.from({ length: 6 }, (_, index) => `skeleton-${index}`);

export function NewsPage() {
  const { t } = useTranslation();
  const { page } = route.useSearch();
  const { data, isError, error, refetch, isFetching, isPlaceholderData } = useQuery(
    catalogNewsQueryOptions({ page, pageSize: NEWS_PAGE_SIZE }),
  );
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <BreadcrumbTrail steps={[{ label: t('nav.news') }]} />
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t('pages.news.heading')}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t('pages.news.lead')}</p>
      {isError && !data && (
        <div className="mt-8">
          <ErrorState error={error} onRetry={() => void refetch()} isRetrying={isFetching} />
        </div>
      )}
      {!data && !isError && (
        <ul aria-hidden className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SKELETON_KEYS.map((key) => (
            <li key={key}>
              <Skeleton className="aspect-3/2 w-full rounded-xl" />
              <Skeleton className="mt-3 h-5 w-3/4" />
              <Skeleton className="mt-2 h-4 w-full" />
            </li>
          ))}
        </ul>
      )}
      {data && data.total === 0 && <p className="mt-8 text-muted-foreground">{t('pages.news.empty')}</p>}
      {data && data.items.length > 0 && (
        <>
          <ul
            className={`mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${isPlaceholderData ? 'opacity-60 transition-opacity' : ''}`}
          >
            {data.items.map((newsItem) => (
              <li key={newsItem.id}>
                <NewsCard newsItem={newsItem} />
              </li>
            ))}
          </ul>
        </>
      )}
      {data && data.total > 0 && (
        <div className="mt-8 flex justify-center">
          <PagePagination page={page ?? 1} totalPages={Math.ceil(data.total / NEWS_PAGE_SIZE)} />
        </div>
      )}
    </section>
  );
}
