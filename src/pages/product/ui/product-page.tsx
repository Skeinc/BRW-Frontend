import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { catalogProductQueryOptions } from '@/entities/product';
import { Badge } from '@/shared/ui/badge';
import { BreadcrumbTrail } from '@/shared/ui/breadcrumb-trail';
import { ProductBenefits } from './product-benefits';
import { ProductDescription } from './product-description';
import { ProductFaq } from './product-faq';
import { ProductGallery } from './product-gallery';
import { ProductSpecs } from './product-specs';
import { ProductSummary } from './product-summary';
import { SimilarProducts } from './similar-products';

const route = getRouteApi('/product/$productId');

export function ProductPage() {
  const { t } = useTranslation();
  const { productId } = route.useParams();
  const { data: product } = useSuspenseQuery(catalogProductQueryOptions(productId));
  const { discountPercent, isHit } = product;
  return (
    <article className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <BreadcrumbTrail
        steps={[
          { label: t('nav.catalog'), to: 'catalog' },
          ...product.breadcrumbs.map((step) => ({
            label: step.name,
            to: { categoryId: step.id },
          })),
          { label: product.name },
        ]}
      />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-10">
        <ProductGallery
          key={product.id}
          name={product.name}
          images={product.images}
          overlay={
            (discountPercent !== null || isHit) && (
              <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                {discountPercent !== null && (
                  <Badge className="tabular-price bg-primary text-primary-foreground">{`-${discountPercent}%`}</Badge>
                )}
                {isHit && (
                  <Badge variant="outline" className="bg-card text-primary">
                    {t('catalog.badge.hit')}
                  </Badge>
                )}
              </div>
            )
          }
        />
        <div className="flex flex-col gap-6">
          <ProductSummary product={product} />
          <ProductBenefits />
        </div>
      </div>
      <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
        <ProductSpecs product={product} />
        {product.description && <ProductDescription text={product.description} />}
      </div>
      <div className="mt-14">
        <ProductFaq />
      </div>
      <div className="mt-14">
        <SimilarProducts product={product} />
      </div>
    </article>
  );
}
