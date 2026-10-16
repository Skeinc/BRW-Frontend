import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { AdornedInput } from '@/shared/ui/adorned-input';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import type { ProductFormValues } from '../model/product-form-schema';

const DIMENSION_FIELDS = ['widthMm', 'heightMm', 'heightMaxMm', 'depthMm', 'lengthMm'] as const;
const TEXT_FIELDS = ['material', 'colorBody', 'colorFacade'] as const;

/** Dimensions in millimetres, material and colours. */
export function ProductDetailsFields() {
  const { t } = useTranslation();
  const { register, formState } = useFormContext<ProductFormValues>();
  const errors = formState.errors;

  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">{t('admin.products.fields.dimensions')}</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {DIMENSION_FIELDS.map((name) => (
            <Field key={name} data-invalid={!!errors[name] || undefined}>
              <FieldLabel htmlFor={`product-${name}`} className="text-muted-foreground">
                {t(`admin.products.fields.${name}`)}
              </FieldLabel>
              <AdornedInput
                id={`product-${name}`}
                suffix={t('admin.products.fields.mm')}
                inputMode="numeric"
                autoComplete="off"
                aria-invalid={!!errors[name] || undefined}
                {...register(name)}
              />
              <FieldError errors={[translateFieldError(errors[name], t)]} />
            </Field>
          ))}
        </div>
        <FieldDescription>{t('admin.products.fields.dimensionsHint')}</FieldDescription>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {TEXT_FIELDS.map((name) => (
          <Field key={name} data-invalid={!!errors[name] || undefined}>
            <FieldLabel htmlFor={`product-${name}`}>{t(`admin.products.fields.${name}`)}</FieldLabel>
            <Input
              id={`product-${name}`}
              autoComplete="off"
              aria-invalid={!!errors[name] || undefined}
              {...register(name)}
            />
            <FieldError errors={[translateFieldError(errors[name], t)]} />
          </Field>
        ))}
      </div>
    </>
  );
}
