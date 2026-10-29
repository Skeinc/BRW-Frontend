import type { Solution, SolutionDetail, SolutionInput } from '@/entities/solution';
import { emptyToNull } from '@/shared/lib/form/empty-to-null';
import type { SolutionFormValues } from './solution-form-schema';

/** `solution` carries the elements only in its detail form, which the dialog loads for an edit. */
export function toDefaultValues(solution: Solution | SolutionDetail | null): SolutionFormValues {
  return {
    roomId: solution?.roomId ?? '',
    collectionId: solution?.collectionId ?? '',
    name: solution?.name ?? '',
    description: solution?.description ?? '',
    price: solution?.price ?? '',
    products: solution && 'products' in solution ? solution.products : [],
    isPublished: solution?.isPublished ?? true,
  };
}

/** The sort order is not asked from the user: a new solution goes to the end of its room. */
export function toInput(values: SolutionFormValues): SolutionInput {
  return {
    roomId: values.roomId,
    collectionId: values.collectionId,
    name: values.name.trim(),
    description: emptyToNull(values.description),
    price: values.price.trim().replace(',', '.'),
    isPublished: values.isPublished,
    productIds: values.products.map((item) => item.id),
  };
}
