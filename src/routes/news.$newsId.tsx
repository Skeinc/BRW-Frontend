import { createFileRoute } from '@tanstack/react-router';
import { buildNewsItemJsonLd, catalogNewsItemQueryOptions, catalogNewsQueryOptions } from '@/entities/news';
import { NewsItemPage, RELATED_NEWS_PARAMS } from '@/pages/news-item';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildBreadcrumbTrailJsonLd } from '@/shared/lib/build-breadcrumb-json-ld';
import { buildHead } from '@/shared/lib/build-head';
import { rethrowAsNotFound } from '@/shared/lib/rethrow-as-not-found';

export const Route = createFileRoute('/news/$newsId')({
  loader: async ({ context, params }) => {
    const newsItem = await context.queryClient
      .ensureQueryData(catalogNewsItemQueryOptions(params.newsId))
      .catch(rethrowAsNotFound);
    await Promise.allSettled([context.queryClient.ensureQueryData(catalogNewsQueryOptions(RELATED_NEWS_PARAMS))]);
    return { newsItem };
  },
  head: ({ loaderData, params, matches }) => {
    const language = readHeadLanguage(matches);
    const newsItem = loaderData?.newsItem;
    const path = `/news/${params.newsId}`;
    if (!newsItem) {
      return buildHead({
        title: translate(language, 'pages.newsItem.fallbackTitle'),
        description: translate(language, 'pages.news.description'),
        path,
      });
    }
    return buildHead({
      title: newsItem.seoTitle ?? translate(language, 'pages.newsItem.title', { title: newsItem.title }),
      description: newsItem.seoDescription ?? newsItem.excerpt ?? translate(language, 'pages.news.description'),
      path,
      ogImage: newsItem.images[0]?.url,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          buildBreadcrumbTrailJsonLd(language, [
            { name: translate(language, 'nav.news'), path: '/news' },
            { name: newsItem.title, path },
          ]),
          buildNewsItemJsonLd(newsItem, path),
        ],
      },
    });
  },
  component: NewsItemPage,
});
