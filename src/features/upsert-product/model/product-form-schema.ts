import { z } from 'zod';
import { STOCK_STATUSES } from '@/entities/product';

/** Up to 10 digits and up to 2 after the point, as the API requires. */
const PRICE_PATTERN = /^\d{1,10}(\.\d{1,2})?$/;
const MAX_DIMENSION_MM = 100_000;

const optionalDimension = z
  .string()
  .trim()
  .refine((value) => value === '' || (/^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= MAX_DIMENSION_MM), {
    error: 'admin.products.validation.dimension',
  });

const optionalText = (maxLength: number) => z.string().max(maxLength, { error: 'admin.validation.tooLong' });

export const productFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { error: 'admin.validation.required' })
      .max(255, { error: 'admin.validation.tooLong' }),
    categoryId: z.string().min(1, { error: 'admin.validation.required' }),
    collectionId: z.string(),
    sku: optionalText(64),
    description: z.string(),
    price: z
      .string()
      .trim()
      .min(1, { error: 'admin.validation.required' })
      .regex(PRICE_PATTERN, { error: 'admin.products.validation.price' }),
    oldPrice: z
      .string()
      .trim()
      .refine((value) => value === '' || PRICE_PATTERN.test(value), { error: 'admin.products.validation.price' }),
    stockStatus: z.enum(STOCK_STATUSES),
    widthMm: optionalDimension,
    heightMm: optionalDimension,
    heightMaxMm: optionalDimension,
    depthMm: optionalDimension,
    lengthMm: optionalDimension,
    material: optionalText(100),
    colorBody: optionalText(100),
    colorFacade: optionalText(100),
    attributes: z.array(z.object({ key: z.string(), value: z.string() })),
    isPublished: z.boolean(),
    isHit: z.boolean(),
    seoTitle: optionalText(120),
    seoDescription: optionalText(320),
  })
  .superRefine((values, context) => {
    const seen = new Set<string>();
    values.attributes.forEach((row, index) => {
      const key = row.key.trim().toLowerCase();
      if (key === '') {
        if (row.value.trim() !== '') {
          context.addIssue({
            code: 'custom',
            path: ['attributes', index, 'key'],
            message: 'admin.products.validation.attributeKey',
          });
        }
        return;
      }
      if (seen.has(key)) {
        context.addIssue({
          code: 'custom',
          path: ['attributes', index, 'key'],
          message: 'admin.products.validation.attributeDuplicate',
        });
      }
      seen.add(key);
    });
  });

export type ProductFormValues = z.infer<typeof productFormSchema>;
