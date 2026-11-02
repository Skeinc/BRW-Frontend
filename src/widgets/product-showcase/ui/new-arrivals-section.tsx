import { useQuery } from '@tanstack/react-query';
import { catalogProductsQueryOptions, NEW_ARRIVALS_PARAMS } from '@/entities/product';
import { ProductSlider } from './product-slider';

export function NewArrivalsSection() {
  const { data } = useQuery(catalogProductsQueryOptions(NEW_ARRIVALS_PARAMS));
  if (!data || data.items.length === 0) {
    return null;
  }
  return (
    <ProductSlider id="home-new-arrivals" textKey="pages.home.newArrivals" products={data.items} highlight="new" />
  );
}
