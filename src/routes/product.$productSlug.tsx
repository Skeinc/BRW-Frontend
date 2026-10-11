import { createFileRoute } from '@tanstack/react-router';
import { ProductPage } from '@/pages/product';
import { i18n } from '@/shared/i18n';
import { buildHead } from '@/shared/lib/build-head';

export const Route = createFileRoute('/product/$productSlug')({
  head: ({ params }) =>
    buildHead({
      title: i18n.t('pages.product.title', { slug: params.productSlug }),
      description: i18n.t('pages.product.description', { slug: params.productSlug }),
      path: `/product/${params.productSlug}`,
    }),
  component: ProductRoute,
});

function ProductRoute() {
  const { productSlug } = Route.useParams();
  return <ProductPage productSlug={productSlug} />;
}
