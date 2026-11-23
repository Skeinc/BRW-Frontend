import { useQuery } from '@tanstack/react-query';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CollectionSelect } from '@/entities/collection';
import { canHostSolution, roomOptionsQueryOptions, RoomSelect } from '@/entities/room';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { RequiredMark } from '@/shared/ui/required-mark';
import { Textarea } from '@/shared/ui/textarea';
import type { SolutionFormValues } from '../model/solution-form-schema';

export function SolutionMainFields() {
  const { t } = useTranslation();
  const { register, control, formState, getValues, setValue } = useFormContext<SolutionFormValues>();
  const errors = formState.errors;
  const collectionId = useWatch({ control, name: 'collectionId' });
  const rooms = useQuery(roomOptionsQueryOptions);
  const hasNoRoom =
    collectionId !== '' && rooms.isSuccess && !rooms.data.some((room) => canHostSolution(room, collectionId));

  /** A room that cannot host a solution of the newly chosen collection is cleared, so the admin picks again. */
  const changeCollection = (next: string) => {
    setValue('collectionId', next, { shouldDirty: true, shouldValidate: formState.isSubmitted });
    const room = rooms.data?.find((option) => option.id === getValues('roomId'));
    if (room && next !== '' && !canHostSolution(room, next)) {
      setValue('roomId', '', { shouldDirty: true });
    }
  };

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
                onValueChange={changeCollection}
                noneLabel={t('admin.solutions.fields.collectionNone')}
              />
            )}
          />
          <FieldError errors={[translateFieldError(errors.collectionId, t)]} />
        </Field>
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
                solutionCollectionId={collectionId || undefined}
              />
            )}
          />
          {hasNoRoom && <FieldDescription>{t('admin.solutions.fields.roomNoneForCollection')}</FieldDescription>}
          <FieldError errors={[translateFieldError(errors.roomId, t)]} />
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
