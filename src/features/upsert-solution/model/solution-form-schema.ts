import { z } from 'zod';

export const solutionFormSchema = z.object({
  roomId: z.string().min(1, { error: 'admin.validation.required' }),
  collectionId: z.string().min(1, { error: 'admin.validation.required' }),
  name: z
    .string()
    .trim()
    .min(1, { error: 'admin.validation.required' })
    .max(160, { error: 'admin.validation.tooLong' }),
  description: z.string(),
  price: z
    .string()
    .trim()
    .min(1, { error: 'admin.validation.required' })
    .regex(/^\d{1,10}([.,]\d{1,2})?$/, { error: 'admin.validation.priceInvalid' }),
  products: z.array(z.object({ id: z.string(), name: z.string() })).max(50, { error: 'admin.validation.tooMany' }),
  isPublished: z.boolean(),
});

export type SolutionFormValues = z.infer<typeof solutionFormSchema>;
