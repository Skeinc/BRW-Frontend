import type { TFunction } from 'i18next';
import { ApiError } from './types';

const KNOWN_API_ERROR_CODES = new Set([
  'CATEGORY_NOT_FOUND',
  'PRODUCT_NOT_FOUND',
  'SLUG_TAKEN',
  'VALIDATION_ERROR',
  'SKU_TAKEN',
  'CATEGORY_DEPTH_EXCEEDED',
  'CATEGORY_NOT_EMPTY',
  'COLLECTION_NOT_FOUND',
  'COLLECTION_NOT_EMPTY',
  'PRODUCT_HAS_ORDERS',
  'ARTICLE_NOT_FOUND',
  'NEWS_NOT_FOUND',
  'ORDER_NOT_FOUND',
  'ORDER_ITEM_UNAVAILABLE',
  'ORDER_STATUS_INVALID',
  'IMAGE_INVALID',
  'IMAGE_NOT_FOUND',
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
