import type { FieldError as RhfFieldError } from 'react-hook-form';
import type { TFunction } from 'i18next';

export function translateFieldError(error: RhfFieldError | undefined, t: TFunction): { message: string } | undefined {
  if (!error?.message) {
    return undefined;
  }
  return { message: t(error.message) };
}
