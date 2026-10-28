import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { CharCounter } from '@/shared/ui/seo-preview';
import { Field, FieldError, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { RequiredMark } from '@/shared/ui/required-mark';
import { Textarea } from '@/shared/ui/textarea';
import { useWatch } from 'react-hook-form';
import type { NewsItemFormValues } from '../model/news-form-schema';
import { NewsItemContentField } from './news-content-field';

const EXCERPT_MAX = 500;

export function NewsItemMainFields() {
  const { t } = useTranslation();
  const { register, control, formState } = useFormContext<NewsItemFormValues>();
  const errors = formState.errors;
  const excerpt = useWatch({ control, name: 'excerpt' });

  return (
    <>
      <Field data-invalid={!!errors.title || undefined}>
        <FieldLabel htmlFor="news-title">
          {t('admin.news.fields.title')}
          <RequiredMark />
        </FieldLabel>
        <Input
          id="news-title"
          autoComplete="off"
          placeholder={t('admin.news.fields.titlePlaceholder')}
          aria-required
          aria-invalid={!!errors.title || undefined}
          {...register('title')}
        />
        <FieldError errors={[translateFieldError(errors.title, t)]} />
      </Field>
      <Field data-invalid={!!errors.excerpt || undefined}>
        <div className="flex items-center justify-between gap-2">
          <FieldLabel htmlFor="news-excerpt">{t('admin.news.fields.excerpt')}</FieldLabel>
          <CharCounter value={excerpt} max={EXCERPT_MAX} />
        </div>
        <Textarea
          id="news-excerpt"
          className="min-h-20"
          placeholder={t('admin.news.fields.excerptPlaceholder')}
          aria-invalid={!!errors.excerpt || undefined}
          {...register('excerpt')}
        />
        <FieldError errors={[translateFieldError(errors.excerpt, t)]} />
      </Field>
      <NewsItemContentField />
    </>
  );
}
