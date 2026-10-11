import type { TFunction } from 'i18next';
import { ApiError } from './types';

const KNOWN_API_ERROR_CODES = new Set([
  'CATEGORY_NOT_FOUND',
  'PRODUCT_NOT_FOUND',
  'SLUG_TAKEN',
  'VALIDATION_FAILED',
  'UNAUTHORIZED',
  'NETWORK_ERROR',
  'INTERNAL_ERROR',
]);

/**
 * Maps API / unknown errors to a localized user-facing string.
 * Never returns the raw English API message.
 */
export function getApiErrorMessage(error: unknown, t: TFunction): string {
  if (error instanceof ApiError && KNOWN_API_ERROR_CODES.has(error.code)) {
    return t(`api.errors.${error.code}`);
  }
  return t('api.errors.GENERIC');
}
