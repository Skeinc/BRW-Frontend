import { createFileRoute } from '@tanstack/react-router';
import { catalogArticlesQueryOptions } from '@/entities/article';
import { catalogCategoriesQueryOptions } from '@/entities/category';
import { catalogNewsQueryOptions } from '@/entities/news';
import { catalogProductsQueryOptions, HITS_PARAMS, NEW_ARRIVALS_PARAMS } from '@/entities/product';
import { catalogRoomsQueryOptions } from '@/entities/room';
import { catalogSlidesQueryOptions } from '@/entities/slide';
import { HomePage } from '@/pages/home';
import { LATEST_ARTICLES_PARAMS } from '@/widgets/latest-articles';
import { LATEST_NEWS_PARAMS } from '@/widgets/latest-news';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildHead } from '@/shared/lib/build-head';
import { buildOrganizationJsonLd } from '@/shared/lib/build-organization-json-ld';

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await Promise.allSettled([
      context.queryClient.ensureQueryData(catalogSlidesQueryOptions),
      context.queryClient.ensureQueryData(catalogCategoriesQueryOptions),
      context.queryClient.ensureQueryData(catalogRoomsQueryOptions),
      context.queryClient.ensureQueryData(catalogProductsQueryOptions(NEW_ARRIVALS_PARAMS)),
      context.queryClient.ensureQueryData(catalogProductsQueryOptions(HITS_PARAMS)),
      context.queryClient.ensureQueryData(catalogArticlesQueryOptions(LATEST_ARTICLES_PARAMS)),
      context.queryClient.ensureQueryData(catalogNewsQueryOptions(LATEST_NEWS_PARAMS)),
    ]);
  },
  head: ({ matches }) => {
    const language = readHeadLanguage(matches);
    return buildHead({
      title: translate(language, 'pages.home.title'),
      description: translate(language, 'pages.home.description'),
      path: '/',
      jsonLd: buildOrganizationJsonLd(language),
    });
  },
  component: HomePage,
});
