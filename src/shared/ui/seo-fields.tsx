import type { FieldError as RhfFieldError, UseFormRegisterReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { Field, FieldDescription, FieldError, FieldLabel } from './field';
import { Input } from './input';
import { CharCounter, SeoPreview } from './seo-preview';
import { Textarea } from './textarea';

const TITLE_MAX = 120;
const DESCRIPTION_MAX = 320;

interface SeoFieldsProps {
  /** Prefix of the field ids, for example `product`. */
  idPrefix: string;
  title: { registration: UseFormRegisterReturn; value: string; error?: RhfFieldError };
  description: { registration: UseFormRegisterReturn; value: string; error?: RhfFieldError };
  /** What search engines show when the SEO title or description is empty. */
  fallbackTitle: string;
  fallbackDescription?: string;
}

/** SEO title and description with counters and a preview of the search result. */
export function SeoFields({ idPrefix, title, description, fallbackTitle, fallbackDescription = '' }: SeoFieldsProps) {
  const { t } = useTranslation();
  return (
    <>
      <Field data-invalid={!!title.error || undefined}>
        <div className="flex items-center justify-between gap-2">
          <FieldLabel htmlFor={`${idPrefix}-seo-title`}>{t('ui.editor.seoTitle')}</FieldLabel>
          <CharCounter value={title.value} max={TITLE_MAX} />
        </div>
        <Input
          id={`${idPrefix}-seo-title`}
          autoComplete="off"
          placeholder={fallbackTitle}
          aria-invalid={!!title.error || undefined}
          {...title.registration}
        />
        <FieldError errors={[translateFieldError(title.error, t)]} />
      </Field>
      <Field data-invalid={!!description.error || undefined}>
        <div className="flex items-center justify-between gap-2">
          <FieldLabel htmlFor={`${idPrefix}-seo-description`}>{t('ui.editor.seoDescription')}</FieldLabel>
          <CharCounter value={description.value} max={DESCRIPTION_MAX} />
        </div>
        <Textarea
          id={`${idPrefix}-seo-description`}
          className="min-h-20"
          aria-invalid={!!description.error || undefined}
          {...description.registration}
        />
        <FieldDescription>{t('ui.editor.seoHint')}</FieldDescription>
        <FieldError errors={[translateFieldError(description.error, t)]} />
      </Field>
      <SeoPreview title={title.value || fallbackTitle} description={description.value || fallbackDescription} />
    </>
  );
}
