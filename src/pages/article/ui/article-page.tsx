import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ArticleCard, catalogArticleQueryOptions, catalogArticlesQueryOptions } from '@/entities/article';
import { formatDate } from '@/shared/lib/format-date';
import { BreadcrumbTrail } from '@/shared/ui/breadcrumb-trail';
import { MarkdownContent } from '@/shared/ui/markdown-content';
import { RELATED_ARTICLES_COUNT, RELATED_ARTICLES_PARAMS } from '../model/related-articles';

const route = getRouteApi('/articles/$articleId');

export function ArticlePage() {
  const { t, i18n } = useTranslation();
  const { articleId } = route.useParams();
  const { data: article } = useSuspenseQuery(catalogArticleQueryOptions(articleId));
  const { data: latest } = useQuery(catalogArticlesQueryOptions(RELATED_ARTICLES_PARAMS));
  const related = (latest?.items ?? []).filter((item) => item.id !== article.id).slice(0, RELATED_ARTICLES_COUNT);
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <BreadcrumbTrail steps={[{ label: t('nav.articles'), to: 'articles' }, { label: article.title }]} />
      <article>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{article.title}</h1>
        {article.publishedAt && (
          <time dateTime={article.publishedAt} className="mt-3 block text-sm text-muted-foreground">
            {formatDate(article.publishedAt, i18n.language)}
          </time>
        )}
        <div className="mt-6">
          <MarkdownContent content={article.content} demoteHeadings />
        </div>
      </article>
      {related.length > 0 && (
        <section aria-labelledby="related-articles" className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <h2 id="related-articles" className="text-2xl font-bold tracking-tight md:text-3xl">
              {t('pages.article.related')}
            </h2>
            <Link
              to="/articles"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:text-primary"
            >
              {t('pages.article.all')}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.id}>
                <ArticleCard article={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
