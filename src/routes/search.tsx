import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { SearchPage } from '@/pages/search';
import { i18n } from '@/shared/i18n';
import { buildHead } from '@/shared/lib/build-head';

const searchSchema = z.object({
  q: z.string().optional().catch(undefined),
});

export const Route = createFileRoute('/search')({
  validateSearch: searchSchema,
  head: ({ match }) =>
    buildHead({
      title: match.search.q
        ? i18n.t('pages.search.titleWithQuery', { q: match.search.q })
        : i18n.t('pages.search.title'),
      description: i18n.t('pages.search.description'),
      path: '/search',
      isNoIndex: true,
    }),
  component: SearchRoute,
});

function SearchRoute() {
  const { q } = Route.useSearch();
  return <SearchPage q={q} />;
}
