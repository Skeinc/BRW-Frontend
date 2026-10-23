import type { Product, ProductInput } from '@/entities/product';
import { emptyToNull } from '@/shared/lib/form/empty-to-null';
import type { ProductFormValues } from './product-form-schema';

const text = (value: string | null): string => value ?? '';
const dimension = (value: number | null): string => (value === null ? '' : String(value));
const toDimension = (value: string): number | null => (value.trim() === '' ? null : Number(value));

export function toDefaultValues(product: Product | null): ProductFormValues {
  return {
    name: product?.name ?? '',
    categoryId: product?.categoryId ?? '',
    collectionId: product?.collectionId ?? '',
    sku: text(product?.sku ?? null),
    description: text(product?.description ?? null),
    price: product?.price ?? '',
    oldPrice: text(product?.oldPrice ?? null),
    stockStatus: product?.stockStatus ?? 'in_stock',
    widthMm: dimension(product?.widthMm ?? null),
    heightMm: dimension(product?.heightMm ?? null),
    heightMaxMm: dimension(product?.heightMaxMm ?? null),
    depthMm: dimension(product?.depthMm ?? null),
    lengthMm: dimension(product?.lengthMm ?? null),
    material: text(product?.material ?? null),
    colorBody: text(product?.colorBody ?? null),
    colorFacade: text(product?.colorFacade ?? null),
    attributes: Object.entries(product?.attributes ?? {}).map(([key, value]) => ({ key, value })),
    isPublished: product?.isPublished ?? true,
    isHit: product?.isHit ?? false,
    seoTitle: text(product?.seoTitle ?? null),
    seoDescription: text(product?.seoDescription ?? null),
  };
}

/** The address (slug) is not asked from the user: the API builds it from the name. */
export function toInput(values: ProductFormValues): ProductInput {
  return {
    categoryId: values.categoryId,
    collectionId: values.collectionId || null,
    name: values.name.trim(),
    sku: emptyToNull(values.sku),
    description: emptyToNull(values.description),
    price: values.price.trim(),
    oldPrice: emptyToNull(values.oldPrice),
    stockStatus: values.stockStatus,
    widthMm: toDimension(values.widthMm),
    heightMm: toDimension(values.heightMm),
    heightMaxMm: toDimension(values.heightMaxMm),
    depthMm: toDimension(values.depthMm),
    lengthMm: toDimension(values.lengthMm),
    material: emptyToNull(values.material),
    colorBody: emptyToNull(values.colorBody),
    colorFacade: emptyToNull(values.colorFacade),
    attributes: Object.fromEntries(
      values.attributes
        .filter((row) => row.key.trim() !== '')
        .map((row) => [row.key.trim(), row.value.trim()] as const),
    ),
    isPublished: values.isPublished,
    isHit: values.isHit,
    seoTitle: emptyToNull(values.seoTitle),
    seoDescription: emptyToNull(values.seoDescription),
  };
}
