import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { CategoryPage } from '@/pages/category';
import { i18n } from '@/shared/i18n';
import { buildHead } from '@/shared/lib/build-head';

const categorySearchSchema = z.object({
  page: z.coerce.number().int().min(1).optional().catch(undefined),
});

export const Route = createFileRoute('/catalog/$categorySlug')({
  validateSearch: categorySearchSchema,
  head: ({ params }) =>
    buildHead({
      title: i18n.t('pages.category.title', { slug: params.categorySlug }),
      description: i18n.t('pages.category.description', { slug: params.categorySlug }),
      path: `/catalog/${params.categorySlug}`,
    }),
  component: CategoryRoute,
});

function CategoryRoute() {
  const { categorySlug } = Route.useParams();
  return <CategoryPage categorySlug={categorySlug} />;
}
