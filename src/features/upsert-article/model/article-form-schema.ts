import { z } from 'zod';

export const articleFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: 'admin.validation.required' })
    .max(255, { error: 'admin.validation.tooLong' }),
  excerpt: z.string().max(500, { error: 'admin.validation.tooLong' }),
  content: z
    .string()
    .refine((value) => value.trim() !== '', { error: 'admin.validation.required' })
    .max(200_000, { error: 'admin.validation.tooLong' }),
  isPublished: z.boolean(),
  /** Value of a `datetime-local` input; blank means "stamp the time of the first publication". */
  publishedAt: z.string(),
  seoTitle: z.string().max(120, { error: 'admin.validation.tooLong' }),
  seoDescription: z.string().max(320, { error: 'admin.validation.tooLong' }),
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>;
