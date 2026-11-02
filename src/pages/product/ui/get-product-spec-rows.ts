import type { TFunction } from 'i18next';
import { formatCm, type CatalogProductDetail } from '@/entities/product';

/** Filled specification rows as [label, value] pairs, in display order. */
export function getProductSpecRows(product: CatalogProductDetail, t: TFunction, language: string): [string, string][] {
  const sized = (mm: number | null): string | null => {
    const value = formatCm(mm, language);
    return value === null ? null : `${value} ${t('product.cm')}`;
  };
  const rows: [string, string | null][] = [
    [t('product.specs.width'), sized(product.widthMm)],
    [t('product.specs.length'), sized(product.lengthMm)],
    [t('product.specs.height'), sized(product.heightMm)],
    [t('product.specs.heightMax'), sized(product.heightMaxMm)],
    [t('product.specs.depth'), sized(product.depthMm)],
    [t('product.specs.material'), product.material],
    [t('product.specs.colorBody'), product.colorBody],
    [t('product.specs.colorFacade'), product.colorFacade],
    ...Object.entries(product.attributes),
  ];
  return rows.filter((row): row is [string, string] => row[1] !== null && row[1] !== '');
}
