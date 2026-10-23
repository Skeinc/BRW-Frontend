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

/** Total of one line as an API money string, computed in cents to avoid float drift. */
export function getLineTotal(price: string, qty: number): string {
  return ((toCents(price) * qty) / CENTS).toFixed(2);
}

interface CartItems {
  items: CartItem[];
  /** Money strings: `subtotal` at the old prices, `discount` is what the old prices add, `total` is what is payable. */
  subtotal: string;
  discount: string;
  total: string;
  /** Pieces that will be ordered; unavailable products are not counted. */
  count: number;
  isPending: boolean;
}

/** Cart lines joined with fresh product data. */
export function useCartItems(): CartItems {
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
  let totalCents = 0;
  let subtotalCents = 0;
  let count = 0;
  for (const { line, product } of items) {
    if (product) {
      count += line.qty;
      totalCents += toCents(product.price) * line.qty;
      subtotalCents += toCents(product.oldPrice ?? product.price) * line.qty;
    }
  }
  return {
    items,
    subtotal: (subtotalCents / CENTS).toFixed(2),
    discount: ((subtotalCents - totalCents) / CENTS).toFixed(2),
    total: (totalCents / CENTS).toFixed(2),
    count,
    isPending: items.some((item) => item.isPending),
  };
}
