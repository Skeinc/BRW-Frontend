import type { CatalogProductCard } from '@/entities/product';
import { AddToCartButton } from './add-to-cart-button';

/** Footer for `ProductCard`: a small cart button next to the price. */
export function ProductCardCartButton({ product }: { product: CatalogProductCard }) {
  return (
    <AddToCartButton
      productId={product.id}
      stockStatus={product.stockStatus}
      name={product.name}
      price={product.price}
      isCompact
    />
  );
}
