import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Field, FieldDescription, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { PublishCard } from '@/shared/ui/publish-card';
import { SeoFields } from '@/shared/ui/seo-fields';
import { toDateTimeLocalValue } from '@/shared/lib/datetime-local';
import type { ArticleFormValues } from '../model/article-form-schema';

export function ArticlePublicationFields() {
  const { t } = useTranslation();
  const { register, control, formState, getValues, setValue } = useFormContext<ArticleFormValues>();
  const [title, excerpt, seoTitle, seoDescription] = useWatch({
    control,
    name: ['title', 'excerpt', 'seoTitle', 'seoDescription'],
  });

  return (
    <>
      <Controller
        control={control}
        name="isPublished"
        render={({ field }) => (
          <PublishCard
            id="article-published"
            checked={field.value}
            onCheckedChange={(checked) => {
              field.onChange(checked);
              if (checked && getValues('publishedAt') === '') {
                setValue('publishedAt', toDateTimeLocalValue(new Date().toISOString()), { shouldDirty: true });
              }
            }}
            publishedText={t('admin.articles.fields.publishedText')}
            draftText={t('admin.articles.fields.draftText')}
          />
        )}
      />
      <Field>
        <FieldLabel htmlFor="article-published-at">{t('admin.articles.fields.publishedAt')}</FieldLabel>
        <Input id="article-published-at" type="datetime-local" className="sm:max-w-xs" {...register('publishedAt')} />
        <FieldDescription>{t('admin.articles.fields.publishedAtHint')}</FieldDescription>
      </Field>
      <SeoFields
        idPrefix="article"
        title={{ registration: register('seoTitle'), value: seoTitle, error: formState.errors.seoTitle }}
        description={{
          registration: register('seoDescription'),
          value: seoDescription,
          error: formState.errors.seoDescription,
        }}
        fallbackTitle={title}
        fallbackDescription={excerpt}
      />
    </>
  );
}
