import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { RequiredMark } from '@/shared/ui/required-mark';
import type { SlideFormValues } from '../model/slide-form-schema';

export function SlideMainFields() {
  const { t } = useTranslation();
  const { register, formState } = useFormContext<SlideFormValues>();
  const errors = formState.errors;

  return (
    <>
      <Field data-invalid={!!errors.alt || undefined}>
        <FieldLabel htmlFor="slide-alt">
          {t('admin.slides.fields.alt')}
          <RequiredMark />
        </FieldLabel>
        <Input
          id="slide-alt"
          autoComplete="off"
          placeholder={t('admin.slides.fields.altPlaceholder')}
          aria-required
          aria-invalid={!!errors.alt || undefined}
          {...register('alt')}
        />
        <FieldDescription>{t('admin.slides.fields.altHint')}</FieldDescription>
        <FieldError errors={[translateFieldError(errors.alt, t)]} />
      </Field>
      <Field data-invalid={!!errors.linkUrl || undefined}>
        <FieldLabel htmlFor="slide-link">{t('admin.slides.fields.link')}</FieldLabel>
        <Input
          id="slide-link"
          autoComplete="off"
          placeholder={t('admin.slides.fields.linkPlaceholder')}
          aria-invalid={!!errors.linkUrl || undefined}
          {...register('linkUrl')}
        />
        <FieldDescription>{t('admin.slides.fields.linkHint')}</FieldDescription>
        <FieldError errors={[translateFieldError(errors.linkUrl, t)]} />
      </Field>
    </>
  );
}
