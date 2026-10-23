import { createFileRoute } from '@tanstack/react-router';
import { buildArticleJsonLd, catalogArticleQueryOptions, catalogArticlesQueryOptions } from '@/entities/article';
import { ArticlePage, RELATED_ARTICLES_PARAMS } from '@/pages/article';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildBreadcrumbTrailJsonLd } from '@/shared/lib/build-breadcrumb-json-ld';
import { buildHead } from '@/shared/lib/build-head';
import { rethrowAsNotFound } from '@/shared/lib/rethrow-as-not-found';

export const Route = createFileRoute('/articles/$articleId')({
  loader: async ({ context, params }) => {
    const article = await context.queryClient
      .ensureQueryData(catalogArticleQueryOptions(params.articleId))
      .catch(rethrowAsNotFound);
    await Promise.allSettled([
      context.queryClient.ensureQueryData(catalogArticlesQueryOptions(RELATED_ARTICLES_PARAMS)),
    ]);
    return { article };
  },
  head: ({ loaderData, params, matches }) => {
    const language = readHeadLanguage(matches);
    const article = loaderData?.article;
    const path = `/articles/${params.articleId}`;
    if (!article) {
      return buildHead({
        title: translate(language, 'pages.article.fallbackTitle'),
        description: translate(language, 'pages.articles.description'),
        path,
      });
    }
    return buildHead({
      title: article.seoTitle ?? translate(language, 'pages.article.title', { title: article.title }),
      description: article.seoDescription ?? article.excerpt ?? translate(language, 'pages.articles.description'),
      path,
      ogImage: article.images[0]?.url,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          buildBreadcrumbTrailJsonLd(language, [
            { name: translate(language, 'nav.articles'), path: '/articles' },
            { name: article.title, path },
          ]),
          buildArticleJsonLd(article, path),
        ],
      },
    });
  },
  component: ArticlePage,
});
