import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ArticleCard, catalogArticlesQueryOptions } from '@/entities/article';

export const LATEST_ARTICLES_PARAMS = { pageSize: 3 } as const;

export function LatestArticles() {
  const { t } = useTranslation();
  const { data } = useQuery(catalogArticlesQueryOptions(LATEST_ARTICLES_PARAMS));
  if (!data || data.items.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby="home-articles" className="mx-auto w-full max-w-7xl px-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            {t('pages.home.articles.eyebrow')}
          </p>
          <h2 id="home-articles" className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
            {t('pages.home.articles.title')}
          </h2>
        </div>
        <Link to="/articles" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:text-primary">
          {t('pages.home.articles.all')}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((article) => (
          <li key={article.id}>
            <ArticleCard article={article} />
          </li>
        ))}
      </ul>
    </section>
  );
}
