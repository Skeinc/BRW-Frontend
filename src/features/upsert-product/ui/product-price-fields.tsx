import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { AdornedInput } from '@/shared/ui/adorned-input';
import { Badge } from '@/shared/ui/badge';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/shared/ui/field';
import { RequiredMark } from '@/shared/ui/required-mark';
import type { ProductFormValues } from '../model/product-form-schema';
import { StockStatusPicker } from './stock-status-picker';

/** Percent off for display only; the API always works with the money strings. */
function getDiscountPercent(price: string, oldPrice: string): number | null {
  const current = Number(price);
  const previous = Number(oldPrice);
  if (!Number.isFinite(current) || !Number.isFinite(previous) || current <= 0 || previous <= current) {
    return null;
  }
  return Math.round((1 - current / previous) * 100);
}

export function ProductPriceFields() {
  const { t } = useTranslation();
  const { register, control, formState } = useFormContext<ProductFormValues>();
  const errors = formState.errors;
  const [price, oldPrice] = useWatch({ control, name: ['price', 'oldPrice'] });
  const discount = getDiscountPercent(price, oldPrice);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field data-invalid={!!errors.price || undefined}>
          <FieldLabel htmlFor="product-price">
            {t('admin.products.fields.price')}
            <RequiredMark />
          </FieldLabel>
          <AdornedInput
            id="product-price"
            suffix="BYN"
            inputMode="decimal"
            autoComplete="off"
            placeholder="1299.00"
            aria-required
            aria-invalid={!!errors.price || undefined}
            {...register('price')}
          />
          <FieldError errors={[translateFieldError(errors.price, t)]} />
        </Field>
        <Field data-invalid={!!errors.oldPrice || undefined}>
          <div className="flex items-center justify-between gap-2">
            <FieldLabel htmlFor="product-old-price">{t('admin.products.fields.oldPrice')}</FieldLabel>
            {discount !== null ? <Badge>{t('admin.products.fields.discount', { percent: discount })}</Badge> : null}
          </div>
          <AdornedInput
            id="product-old-price"
            suffix="BYN"
            inputMode="decimal"
            autoComplete="off"
            aria-invalid={!!errors.oldPrice || undefined}
            {...register('oldPrice')}
          />
          <FieldDescription>{t('admin.products.fields.oldPriceHint')}</FieldDescription>
          <FieldError errors={[translateFieldError(errors.oldPrice, t)]} />
        </Field>
      </div>
      <Field>
        <FieldLabel>{t('admin.products.fields.stockStatus')}</FieldLabel>
        <Controller
          control={control}
          name="stockStatus"
          render={({ field }) => <StockStatusPicker value={field.value} onChange={field.onChange} />}
        />
      </Field>
    </>
  );
}
