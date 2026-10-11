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
  head: ({ params, matches }) => {
    const language = readHeadLanguage(matches);
    return buildHead({
      title: translate(language, 'pages.category.title', { slug: params.categorySlug }),
      description: translate(language, 'pages.category.description', { slug: params.categorySlug }),
      path: `/catalog/${params.categorySlug}`,
    });
  },
  component: CategoryRoute,
});

function CategoryRoute() {
  const { categorySlug } = Route.useParams();
  return <CategoryPage categorySlug={categorySlug} />;
}
