import { get, useFormContext, type FieldError as RhfFieldError, type FieldPath } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { cn } from '@/shared/lib/utils';
import { FieldError } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import type { InstallmentFormValues } from '../model/installment-form-schema';

interface InlineFieldProps {
  name: FieldPath<InstallmentFormValues>;
  /** Accessible name: the field has no visible label, it sits where the text is shown on the page. */
  label: string;
  className?: string;
  multiline?: boolean;
  /** Fields are required unless the schema allows an empty value. */
  optional?: boolean;
  inputMode?: 'numeric';
  type?: 'number';
}

/** A text field styled like the text it edits on the public page. */
export function InlineField({ name, label, className, multiline, optional, inputMode, type }: InlineFieldProps) {
  const { t } = useTranslation();
  const { register, formState } = useFormContext<InstallmentFormValues>();
  const error = get(formState.errors, name) as RhfFieldError | undefined;
  const common = {
    'aria-label': label,
    placeholder: label,
    'aria-required': !optional,
    'aria-invalid': !!error || undefined,
    className: cn(
      'px-2 py-1.5',
      type === 'number' &&
        '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
      className,
    ),
  };
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      {multiline ? (
        <Textarea rows={2} {...common} {...register(name)} />
      ) : (
        <Input
          autoComplete="off"
          type={type}
          inputMode={inputMode}
          {...common}
          {...register(
            name,
            type === 'number'
              ? { setValueAs: (value: string) => (value === '' ? undefined : Number(value)) }
              : undefined,
          )}
        />
      )}
      <FieldError errors={[translateFieldError(error, t)]} />
    </div>
  );
}
