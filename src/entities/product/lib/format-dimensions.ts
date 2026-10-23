import { toLocaleTag } from '@/shared/lib/to-locale-tag';
import type { CatalogProductDetail } from '../model/catalog-types';

const MM_IN_CM = 10;

/** Centimetres with at most one decimal, in the number format of the language, or `null` for a missing size. */
export function formatCm(mm: number | null, locale: string): string | null {
  return mm === null
    ? null
    : new Intl.NumberFormat(toLocaleTag(locale), { maximumFractionDigits: 1 }).format(mm / MM_IN_CM);
}

/** Width × height × depth in centimetres, or `null` when the product has none of them. */
export function formatDimensions(
  product: Pick<CatalogProductDetail, 'widthMm' | 'heightMm' | 'depthMm' | 'lengthMm'>,
  locale: string,
): string | null {
  const parts = [product.widthMm ?? product.lengthMm, product.heightMm, product.depthMm]
    .map((mm) => formatCm(mm, locale))
    .filter((value): value is string => value !== null);
  return parts.length > 0 ? parts.join(' × ') : null;
}
