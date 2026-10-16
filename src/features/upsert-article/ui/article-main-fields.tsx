import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { CharCounter } from '@/shared/ui/seo-preview';
import { Field, FieldError, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { RequiredMark } from '@/shared/ui/required-mark';
import { Textarea } from '@/shared/ui/textarea';
import { useWatch } from 'react-hook-form';
import type { ArticleFormValues } from '../model/article-form-schema';
import { ArticleContentField } from './article-content-field';

const EXCERPT_MAX = 500;

export function ArticleMainFields() {
  const { t } = useTranslation();
  const { register, control, formState } = useFormContext<ArticleFormValues>();
  const errors = formState.errors;
  const excerpt = useWatch({ control, name: 'excerpt' });

  return (
    <>
      <Field data-invalid={!!errors.title || undefined}>
        <FieldLabel htmlFor="article-title">
          {t('admin.articles.fields.title')}
          <RequiredMark />
        </FieldLabel>
        <Input
          id="article-title"
          autoComplete="off"
          placeholder={t('admin.articles.fields.titlePlaceholder')}
          aria-required
          aria-invalid={!!errors.title || undefined}
          {...register('title')}
        />
        <FieldError errors={[translateFieldError(errors.title, t)]} />
      </Field>
      <Field data-invalid={!!errors.excerpt || undefined}>
        <div className="flex items-center justify-between gap-2">
          <FieldLabel htmlFor="article-excerpt">{t('admin.articles.fields.excerpt')}</FieldLabel>
          <CharCounter value={excerpt} max={EXCERPT_MAX} />
        </div>
        <Textarea
          id="article-excerpt"
          className="min-h-20"
          placeholder={t('admin.articles.fields.excerptPlaceholder')}
          aria-invalid={!!errors.excerpt || undefined}
          {...register('excerpt')}
        />
        <FieldError errors={[translateFieldError(errors.excerpt, t)]} />
      </Field>
      <ArticleContentField />
    </>
  );
}
