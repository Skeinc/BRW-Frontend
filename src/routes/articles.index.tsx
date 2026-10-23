import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { catalogArticlesQueryOptions } from '@/entities/article';
import { ARTICLES_PAGE_SIZE, ArticlesPage } from '@/pages/articles';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildBreadcrumbJsonLd } from '@/shared/lib/build-breadcrumb-json-ld';
import { buildHead } from '@/shared/lib/build-head';

const articlesSearchSchema = z.object({
  page: z.coerce.number().int().min(1).optional().catch(undefined),
});

export const Route = createFileRoute('/articles/')({
  validateSearch: articlesSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    await Promise.allSettled([
      context.queryClient.ensureQueryData(
        catalogArticlesQueryOptions({ page: deps.page, pageSize: ARTICLES_PAGE_SIZE }),
      ),
    ]);
  },
  head: ({ match, matches }) => {
    const language = readHeadLanguage(matches);
    const page = match.search.page ?? 1;
    return buildHead({
      title: translate(language, 'pages.articles.title'),
      description: translate(language, 'pages.articles.description'),
      path: page > 1 ? `/articles?page=${page}` : '/articles',
      jsonLd: {
        '@context': 'https://schema.org',
        ...buildBreadcrumbJsonLd(language, translate(language, 'nav.articles'), '/articles'),
      },
    });
  },
  component: ArticlesPage,
});
