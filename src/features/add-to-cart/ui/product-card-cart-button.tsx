import type { CatalogProductCard } from '@/entities/product';
import { AddToCartButton } from './add-to-cart-button';

/** Footer for `ProductCard`: add-to-cart button sized for the card. */
export function ProductCardCartButton({ product }: { product: CatalogProductCard }) {
  return (
    <AddToCartButton
      productId={product.id}
      stockStatus={product.stockStatus}
      name={product.name}
      className="h-11 w-full"
    />
  );
}
