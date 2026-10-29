import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { Field, FieldError, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { RequiredMark } from '@/shared/ui/required-mark';
import { Textarea } from '@/shared/ui/textarea';
import type { RoomFormValues } from '../model/room-form-schema';

export function RoomMainFields() {
  const { t } = useTranslation();
  const { register, formState } = useFormContext<RoomFormValues>();
  const errors = formState.errors;

  return (
    <>
      <Field data-invalid={!!errors.name || undefined}>
        <FieldLabel htmlFor="room-name">
          {t('admin.rooms.fields.name')}
          <RequiredMark />
        </FieldLabel>
        <Input
          id="room-name"
          autoComplete="off"
          placeholder={t('admin.rooms.fields.namePlaceholder')}
          aria-required
          aria-invalid={!!errors.name || undefined}
          {...register('name')}
        />
        <FieldError errors={[translateFieldError(errors.name, t)]} />
      </Field>
      <Field>
        <FieldLabel htmlFor="room-description">{t('admin.rooms.fields.description')}</FieldLabel>
        <Textarea
          id="room-description"
          className="min-h-28"
          placeholder={t('admin.rooms.fields.descriptionPlaceholder')}
          {...register('description')}
        />
      </Field>
    </>
  );
}
