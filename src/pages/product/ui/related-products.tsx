import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  catalogProductsQueryOptions,
  getRelatedProductsParams,
  ProductCard,
  type CatalogProductDetail,
} from '@/entities/product';
import { ProductCardCartButton } from '@/features/add-to-cart';

const RELATED_COUNT = 8;

interface RelatedProductsProps {
  product: CatalogProductDetail;
}

/** Other products of the same collection; products of the same category when the product has no collection. */
export function RelatedProducts({ product }: RelatedProductsProps) {
  const { t } = useTranslation();
  const { data } = useQuery(catalogProductsQueryOptions(getRelatedProductsParams(product)));
  const related = (data?.items ?? []).filter((item) => item.id !== product.id).slice(0, RELATED_COUNT);
  if (related.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby="related-products">
      <h2 id="related-products" className="text-2xl font-bold tracking-tight">
        {t('product.related')}
      </h2>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {related.map((item) => (
          <li key={item.id}>
            <ProductCard product={item} footer={<ProductCardCartButton product={item} />} />
          </li>
        ))}
      </ul>
    </section>
  );
}
