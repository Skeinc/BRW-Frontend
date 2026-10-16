import { z } from 'zod';

export const ROOT_PARENT_VALUE = 'root';

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: 'admin.validation.required' })
    .max(200, { error: 'admin.validation.tooLong' }),
  parentId: z.string(),
  description: z.string(),
  seoTitle: z.string().max(120, { error: 'admin.validation.tooLong' }),
  seoDescription: z.string().max(320, { error: 'admin.validation.tooLong' }),
  isPublished: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
