import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CategorySelect } from '@/entities/category';
import { CollectionSelect } from '@/entities/collection';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { RequiredMark } from '@/shared/ui/required-mark';
import { Textarea } from '@/shared/ui/textarea';
import type { ProductFormValues } from '../model/product-form-schema';

export function ProductMainFields() {
  const { t } = useTranslation();
  const { register, control, formState } = useFormContext<ProductFormValues>();
  const errors = formState.errors;

  return (
    <>
      <Field data-invalid={!!errors.name || undefined}>
        <FieldLabel htmlFor="product-name">
          {t('admin.products.fields.name')}
          <RequiredMark />
        </FieldLabel>
        <Input
          id="product-name"
          autoComplete="off"
          placeholder={t('admin.products.fields.namePlaceholder')}
          aria-required
          aria-invalid={!!errors.name || undefined}
          {...register('name')}
        />
        <FieldDescription>{t('admin.products.fields.nameHint')}</FieldDescription>
        <FieldError errors={[translateFieldError(errors.name, t)]} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field data-invalid={!!errors.categoryId || undefined}>
          <FieldLabel htmlFor="product-category">
            {t('admin.products.fields.category')}
            <RequiredMark />
          </FieldLabel>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <CategorySelect
                id="product-category"
                className="w-full"
                value={field.value}
                placeholder={t('admin.products.fields.categoryPlaceholder')}
                onValueChange={field.onChange}
              />
            )}
          />
          <FieldError errors={[translateFieldError(errors.categoryId, t)]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="product-collection">{t('admin.products.fields.collection')}</FieldLabel>
          <Controller
            control={control}
            name="collectionId"
            render={({ field }) => (
              <CollectionSelect
                id="product-collection"
                className="w-full"
                value={field.value}
                noneLabel={t('admin.products.fields.noCollection')}
                onValueChange={field.onChange}
              />
            )}
          />
        </Field>
      </div>
      <Field data-invalid={!!errors.sku || undefined}>
        <FieldLabel htmlFor="product-sku">{t('admin.products.fields.sku')}</FieldLabel>
        <Input
          id="product-sku"
          autoComplete="off"
          className="sm:max-w-xs"
          aria-invalid={!!errors.sku || undefined}
          {...register('sku')}
        />
        <FieldDescription>{t('admin.products.fields.skuHint')}</FieldDescription>
        <FieldError errors={[translateFieldError(errors.sku, t)]} />
      </Field>
      <Field>
        <FieldLabel htmlFor="product-description">{t('admin.products.fields.description')}</FieldLabel>
        <Textarea
          id="product-description"
          className="min-h-32"
          placeholder={t('admin.products.fields.descriptionPlaceholder')}
          {...register('description')}
        />
      </Field>
    </>
  );
}
