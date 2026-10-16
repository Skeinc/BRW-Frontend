import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { Field, FieldError, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { RequiredMark } from '@/shared/ui/required-mark';
import { Textarea } from '@/shared/ui/textarea';
import type { CollectionFormValues } from '../model/collection-form-schema';

export function CollectionMainFields() {
  const { t } = useTranslation();
  const { register, formState } = useFormContext<CollectionFormValues>();
  const errors = formState.errors;

  return (
    <>
      <Field data-invalid={!!errors.name || undefined}>
        <FieldLabel htmlFor="collection-name">
          {t('admin.collections.fields.name')}
          <RequiredMark />
        </FieldLabel>
        <Input
          id="collection-name"
          autoComplete="off"
          placeholder={t('admin.collections.fields.namePlaceholder')}
          aria-required
          aria-invalid={!!errors.name || undefined}
          {...register('name')}
        />
        <FieldError errors={[translateFieldError(errors.name, t)]} />
      </Field>
      <Field>
        <FieldLabel htmlFor="collection-description">{t('admin.collections.fields.description')}</FieldLabel>
        <Textarea
          id="collection-description"
          className="min-h-28"
          placeholder={t('admin.collections.fields.descriptionPlaceholder')}
          {...register('description')}
        />
      </Field>
    </>
  );
}
