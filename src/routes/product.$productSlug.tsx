import { createFileRoute } from '@tanstack/react-router';
import { ProductPage } from '@/pages/product';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildHead } from '@/shared/lib/build-head';

export const Route = createFileRoute('/product/$productSlug')({
  head: ({ params, matches }) => {
    const language = readHeadLanguage(matches);
    return buildHead({
      title: translate(language, 'pages.product.title', { slug: params.productSlug }),
      description: translate(language, 'pages.product.description', { slug: params.productSlug }),
      path: `/product/${params.productSlug}`,
    });
  },
  component: ProductRoute,
});

function ProductRoute() {
  const { productSlug } = Route.useParams();
  return <ProductPage productSlug={productSlug} />;
}
