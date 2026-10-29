import { z } from 'zod';

export const roomFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: 'admin.validation.required' })
    .max(120, { error: 'admin.validation.tooLong' }),
  description: z.string(),
  seoTitle: z.string().max(120, { error: 'admin.validation.tooLong' }),
  seoDescription: z.string().max(320, { error: 'admin.validation.tooLong' }),
  isPublished: z.boolean(),
});

export type RoomFormValues = z.infer<typeof roomFormSchema>;
