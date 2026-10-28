import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { catalogNewsQueryOptions } from '@/entities/news';
import { NEWS_PAGE_SIZE, NewsPage } from '@/pages/news';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildBreadcrumbJsonLd } from '@/shared/lib/build-breadcrumb-json-ld';
import { buildHead } from '@/shared/lib/build-head';

const newsSearchSchema = z.object({
  page: z.coerce.number().int().min(1).optional().catch(undefined),
});

export const Route = createFileRoute('/news/')({
  validateSearch: newsSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    await Promise.allSettled([
      context.queryClient.ensureQueryData(catalogNewsQueryOptions({ page: deps.page, pageSize: NEWS_PAGE_SIZE })),
    ]);
  },
  head: ({ match, matches }) => {
    const language = readHeadLanguage(matches);
    const page = match.search.page ?? 1;
    return buildHead({
      title: translate(language, 'pages.news.title'),
      description: translate(language, 'pages.news.description'),
      path: page > 1 ? `/news?page=${page}` : '/news',
      jsonLd: {
        '@context': 'https://schema.org',
        ...buildBreadcrumbJsonLd(language, translate(language, 'nav.news'), '/news'),
      },
    });
  },
  component: NewsPage,
});
