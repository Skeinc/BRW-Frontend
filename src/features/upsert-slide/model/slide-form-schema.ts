import { z } from 'zod';

/** A path on this site or an absolute https address; empty means no link. */
const LINK_PATTERN = /^(\/(?!\/)\S*|https:\/\/\S+)$/;

export const slideFormSchema = z.object({
  alt: z.string().trim().min(1, { error: 'admin.validation.required' }).max(255, { error: 'admin.validation.tooLong' }),
  linkUrl: z
    .string()
    .trim()
    .max(500, { error: 'admin.validation.tooLong' })
    .refine((value) => value === '' || LINK_PATTERN.test(value), { error: 'admin.validation.linkInvalid' }),
  isPublished: z.boolean(),
});

export type SlideFormValues = z.infer<typeof slideFormSchema>;
