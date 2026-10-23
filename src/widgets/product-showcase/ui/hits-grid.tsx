import { ProductCard, type CatalogProductCard } from '@/entities/product';
import { Skeleton } from '@/shared/ui/skeleton';
import { ProductCardCartButton } from '@/features/add-to-cart';

const SKELETON_COUNT = 8;
const SKELETON_KEYS = Array.from({ length: SKELETON_COUNT }, (_, index) => `skeleton-${index}`);

interface HitsGridProps {
  products: readonly CatalogProductCard[] | undefined;
}

export function HitsGrid({ products }: HitsGridProps) {
  if (!products) {
    return (
      <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {SKELETON_KEYS.map((key) => (
          <li key={key}>
            <div className="overflow-hidden rounded-xl border bg-card">
              <Skeleton className="aspect-4/5 w-full rounded-none" />
              <div className="flex flex-col gap-2 p-4">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} footer={<ProductCardCartButton product={product} />} />
        </li>
      ))}
    </ul>
  );
}
