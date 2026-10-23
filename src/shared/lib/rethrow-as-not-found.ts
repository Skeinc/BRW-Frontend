import { notFound } from '@tanstack/react-router';
import { ApiError } from '@/shared/api';

const MISSING_STATUSES: readonly number[] = [400, 404];

/** Turns the API answer "no such entity" (404, or 400 for a malformed id) into the router 404; other errors pass through. */
export function rethrowAsNotFound(error: unknown): never {
  if (error instanceof ApiError && MISSING_STATUSES.includes(error.status)) {
    throw notFound();
  }
  throw error;
}
