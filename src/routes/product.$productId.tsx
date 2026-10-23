import { createFileRoute } from '@tanstack/react-router';
import { catalogProductQueryOptions, catalogProductsQueryOptions, buildProductJsonLd } from '@/entities/product';
import { ProductPage } from '@/pages/product';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildBreadcrumbTrailJsonLd } from '@/shared/lib/build-breadcrumb-json-ld';
import { buildHead } from '@/shared/lib/build-head';
import { rethrowAsNotFound } from '@/shared/lib/rethrow-as-not-found';

export const Route = createFileRoute('/product/$productId')({
  loader: async ({ context, params }) => {
    const product = await context.queryClient
      .ensureQueryData(catalogProductQueryOptions(params.productId))
      .catch(rethrowAsNotFound);
    await Promise.allSettled([
      context.queryClient.ensureQueryData(
        catalogProductsQueryOptions({ category: product.category.slug, pageSize: 5 }),
      ),
    ]);
    return { product };
  },
  head: ({ loaderData, params, matches }) => {
    const language = readHeadLanguage(matches);
    const product = loaderData?.product;
    const path = `/product/${params.productId}`;
    if (!product) {
      return buildHead({
        title: translate(language, 'pages.product.fallbackTitle'),
        description: translate(language, 'pages.catalog.description'),
        path,
      });
    }
    const description =
      product.seoDescription ??
      translate(language, 'pages.product.description', { name: product.name, category: product.category.name });
    return buildHead({
      title:
        product.seoTitle ??
        translate(language, 'pages.product.title', { name: product.name, category: product.category.name }),
      description,
      path,
      ogImage: product.images[0]?.url,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          buildBreadcrumbTrailJsonLd(language, [
            { name: translate(language, 'nav.catalog'), path: '/catalog' },
            ...product.breadcrumbs.map((step) => ({ name: step.name, path: `/catalog/${step.id}` })),
            { name: product.name, path },
          ]),
          buildProductJsonLd(product, path),
        ],
      },
    });
  },
  component: ProductPage,
});
