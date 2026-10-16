import type { Category, CategoryInput } from '@/entities/category';
import { emptyToNull } from '@/shared/lib/form/empty-to-null';
import { ROOT_PARENT_VALUE, type CategoryFormValues } from './category-form-schema';

export function toDefaultValues(category: Category | null): CategoryFormValues {
  return {
    name: category?.name ?? '',
    parentId: category?.parentId ?? ROOT_PARENT_VALUE,
    description: category?.description ?? '',
    seoTitle: category?.seoTitle ?? '',
    seoDescription: category?.seoDescription ?? '',
    isPublished: category?.isPublished ?? true,
  };
}

/** The address (slug) and the sort order are not asked from the user: the API builds the address from the name and appends new items. */
export function toInput(values: CategoryFormValues): CategoryInput {
  return {
    name: values.name.trim(),
    parentId: values.parentId === ROOT_PARENT_VALUE ? null : values.parentId,
    description: emptyToNull(values.description),
    seoTitle: emptyToNull(values.seoTitle),
    seoDescription: emptyToNull(values.seoDescription),
    isPublished: values.isPublished,
  };
}
