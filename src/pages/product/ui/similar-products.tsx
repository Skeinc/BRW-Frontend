import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { catalogProductsQueryOptions, ProductCard, type CatalogProductDetail } from '@/entities/product';
import { ProductCardCartButton } from '@/features/add-to-cart';

const SIMILAR_COUNT = 4;

interface SimilarProductsProps {
  product: CatalogProductDetail;
}

export function SimilarProducts({ product }: SimilarProductsProps) {
  const { t } = useTranslation();
  const { data } = useQuery(
    catalogProductsQueryOptions({ category: product.category.slug, pageSize: SIMILAR_COUNT + 1 }),
  );
  const similar = (data?.items ?? []).filter((item) => item.id !== product.id).slice(0, SIMILAR_COUNT);
  if (similar.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby="similar-products">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">{t('product.similar.eyebrow')}</p>
          <h2 id="similar-products" className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
            {t('product.similar.title')}
          </h2>
        </div>
        <Link
          to="/catalog/$categoryId"
          params={{ categoryId: product.category.id }}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:text-primary"
        >
          {t('product.similar.all', { name: product.category.name })}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {similar.map((item) => (
          <li key={item.id}>
            <ProductCard product={item} footer={<ProductCardCartButton product={item} />} />
          </li>
        ))}
      </ul>
    </section>
  );
}
