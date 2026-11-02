import { useQuery } from '@tanstack/react-query';
import { catalogProductsQueryOptions, POPULAR_PARAMS } from '@/entities/product';
import { ProductSlider } from './product-slider';

export function PopularSection() {
  const { data } = useQuery(catalogProductsQueryOptions(POPULAR_PARAMS));
  if (!data || data.items.length === 0) {
    return null;
  }
  return <ProductSlider id="home-popular" textKey="pages.home.popular" products={data.items} />;
}
