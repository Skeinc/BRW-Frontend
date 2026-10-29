import type { Slide, SlideInput } from '@/entities/slide';
import { emptyToNull } from '@/shared/lib/form/empty-to-null';
import type { SlideFormValues } from './slide-form-schema';

export function toDefaultValues(slide: Slide | null): SlideFormValues {
  return {
    alt: slide?.alt ?? '',
    linkUrl: slide?.linkUrl ?? '',
    isPublished: slide?.isPublished ?? true,
  };
}

/** The sort order is not asked from the user: the API appends a new slide to the end. */
export function toInput(values: SlideFormValues): SlideInput {
  return {
    alt: values.alt.trim(),
    linkUrl: emptyToNull(values.linkUrl),
    isPublished: values.isPublished,
  };
}
