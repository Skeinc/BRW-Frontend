import { useQueries } from '@tanstack/react-query';
import { ApiError } from '@/shared/api';
import { catalogProductQueryOptions, type CatalogProductDetail } from '@/entities/product';
import { useCartLines, type CartLine } from './cart-store';

const CENTS = 100;
const NOT_FOUND = 404;

export interface CartItem {
  line: CartLine;
  product: CatalogProductDetail | undefined;
  isPending: boolean;
  /** The product was unpublished or removed; it is excluded from the total. */
  isUnavailable: boolean;
}

function toCents(price: string): number {
  return Math.round(Number(price) * CENTS);
}

/** Cart lines joined with fresh product data. `total` is an API money string. */
export function useCartItems(): { items: CartItem[]; total: string; isPending: boolean } {
  const lines = useCartLines();
  const results = useQueries({
    queries: lines.map((line) => ({
      ...catalogProductQueryOptions(line.productId),
      refetchOnMount: 'always' as const,
    })),
  });
  const items = lines.map<CartItem>((line, index) => {
    const result = results[index];
    return {
      line,
      product: result?.data,
      isPending: result?.isPending ?? true,
      isUnavailable: result?.error instanceof ApiError && result.error.status === NOT_FOUND,
    };
  });
  const totalCents = items.reduce(
    (sum, { line, product }) => (product ? sum + toCents(product.price) * line.qty : sum),
    0,
  );
  return {
    items,
    total: (totalCents / CENTS).toFixed(2),
    isPending: items.some((item) => item.isPending),
  };
}
