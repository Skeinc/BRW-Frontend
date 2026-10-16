import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { CategoryPage } from '@/pages/category';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildHead } from '@/shared/lib/build-head';

const categorySearchSchema = z.object({
  page: z.coerce.number().int().min(1).optional().catch(undefined),
});

export const Route = createFileRoute('/catalog/$categorySlug')({
  validateSearch: categorySearchSchema,
  head: ({ params, match, matches }) => {
    const language = readHeadLanguage(matches);
    const { page } = match.search;
    return buildHead({
      title: translate(language, 'pages.category.title', { slug: params.categorySlug }),
      description: translate(language, 'pages.category.description', { slug: params.categorySlug }),
      path: page && page > 1 ? `/catalog/${params.categorySlug}?page=${page}` : `/catalog/${params.categorySlug}`,
    });
  },
  component: CategoryRoute,
});

function CategoryRoute() {
  const { categorySlug } = Route.useParams();
  return <CategoryPage categorySlug={categorySlug} />;
}
