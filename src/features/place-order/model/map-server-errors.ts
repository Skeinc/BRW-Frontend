import { ApiError } from '@/shared/api';
import type { CheckoutFormValues } from './checkout-form-schema';

const FORM_FIELDS: readonly (keyof CheckoutFormValues)[] = [
  'contactName',
  'phone',
  'email',
  'deliveryMethod',
  'city',
  'address',
  'paymentMethod',
  'comment',
  'consent',
];

/**
 * Fields the API rejected. The details are class-validator messages that start with the property name
 * ("phone must be ..."), so the first word tells which field to highlight.
 */
export function getRejectedFields(error: unknown): (keyof CheckoutFormValues)[] {
  if (!(error instanceof ApiError) || error.code !== 'VALIDATION_ERROR' || !Array.isArray(error.details)) {
    return [];
  }
  const rejected = new Set<keyof CheckoutFormValues>();
  for (const detail of error.details) {
    const property = typeof detail === 'string' ? detail.split(' ')[0] : undefined;
    const field = FORM_FIELDS.find((name) => name === property);
    if (field) {
      rejected.add(field);
    }
  }
  return [...rejected];
}
