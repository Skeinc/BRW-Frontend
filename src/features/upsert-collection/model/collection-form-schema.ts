import { z } from 'zod';

const PRICE_PATTERN = /^\d{1,10}(\.\d{1,2})?$/;

export const collectionFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: 'admin.validation.required' })
    .max(120, { error: 'admin.validation.tooLong' }),
  description: z.string(),
  priceFrom: z
    .string()
    .trim()
    .refine((value) => value === '' || PRICE_PATTERN.test(value), { error: 'admin.products.validation.price' }),
  seoTitle: z.string().max(120, { error: 'admin.validation.tooLong' }),
  seoDescription: z.string().max(320, { error: 'admin.validation.tooLong' }),
  isPublished: z.boolean(),
});

export type CollectionFormValues = z.infer<typeof collectionFormSchema>;
