import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CollectionSelect } from '@/entities/collection';
import { RoomSelect } from '@/entities/room';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { Field, FieldError, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { RequiredMark } from '@/shared/ui/required-mark';
import { Textarea } from '@/shared/ui/textarea';
import type { SolutionFormValues } from '../model/solution-form-schema';

export function SolutionMainFields() {
  const { t } = useTranslation();
  const { register, control, formState } = useFormContext<SolutionFormValues>();
  const errors = formState.errors;

  return (
    <>
      <Field data-invalid={!!errors.name || undefined}>
        <FieldLabel htmlFor="solution-name">
          {t('admin.solutions.fields.name')}
          <RequiredMark />
        </FieldLabel>
        <Input
          id="solution-name"
          autoComplete="off"
          placeholder={t('admin.solutions.fields.namePlaceholder')}
          aria-required
          aria-invalid={!!errors.name || undefined}
          {...register('name')}
        />
        <FieldError errors={[translateFieldError(errors.name, t)]} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field data-invalid={!!errors.roomId || undefined}>
          <FieldLabel htmlFor="solution-room">
            {t('admin.solutions.fields.room')}
            <RequiredMark />
          </FieldLabel>
          <Controller
            control={control}
            name="roomId"
            render={({ field }) => (
              <RoomSelect
                id="solution-room"
                value={field.value}
                onValueChange={field.onChange}
                noneLabel={t('admin.solutions.fields.roomNone')}
              />
            )}
          />
          <FieldError errors={[translateFieldError(errors.roomId, t)]} />
        </Field>
        <Field data-invalid={!!errors.collectionId || undefined}>
          <FieldLabel htmlFor="solution-collection">
            {t('admin.solutions.fields.collection')}
            <RequiredMark />
          </FieldLabel>
          <Controller
            control={control}
            name="collectionId"
            render={({ field }) => (
              <CollectionSelect
                id="solution-collection"
                value={field.value}
                onValueChange={field.onChange}
                noneLabel={t('admin.solutions.fields.collectionNone')}
              />
            )}
          />
          <FieldError errors={[translateFieldError(errors.collectionId, t)]} />
        </Field>
      </div>
      <Field data-invalid={!!errors.price || undefined}>
        <FieldLabel htmlFor="solution-price">
          {t('admin.solutions.fields.price')}
          <RequiredMark />
        </FieldLabel>
        <Input
          id="solution-price"
          inputMode="decimal"
          autoComplete="off"
          className="sm:max-w-48"
          placeholder="738,96"
          aria-required
          aria-invalid={!!errors.price || undefined}
          {...register('price')}
        />
        <FieldError errors={[translateFieldError(errors.price, t)]} />
      </Field>
      <Field>
        <FieldLabel htmlFor="solution-description">{t('admin.solutions.fields.description')}</FieldLabel>
        <Textarea id="solution-description" className="min-h-24" {...register('description')} />
      </Field>
    </>
  );
}
