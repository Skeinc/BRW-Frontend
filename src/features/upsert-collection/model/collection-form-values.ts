import type { Collection, CollectionInput } from '@/entities/collection';
import { emptyToNull } from '@/shared/lib/form/empty-to-null';
import type { CollectionFormValues } from './collection-form-schema';

export function toDefaultValues(collection: Collection | null): CollectionFormValues {
  return {
    name: collection?.name ?? '',
    description: collection?.description ?? '',
    seoTitle: collection?.seoTitle ?? '',
    seoDescription: collection?.seoDescription ?? '',
    isPublished: collection?.isPublished ?? true,
  };
}

/** The address (slug) and the sort order are not asked from the user: the API builds the address from the name and appends new items. */
export function toInput(values: CollectionFormValues): CollectionInput {
  return {
    name: values.name.trim(),
    description: emptyToNull(values.description),
    seoTitle: emptyToNull(values.seoTitle),
    seoDescription: emptyToNull(values.seoDescription),
    isPublished: values.isPublished,
  };
}
