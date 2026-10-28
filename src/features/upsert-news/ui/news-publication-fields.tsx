import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Field, FieldDescription, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { PublishCard } from '@/shared/ui/publish-card';
import { SeoFields } from '@/shared/ui/seo-fields';
import { Switch } from '@/shared/ui/switch';
import { toDateTimeLocalValue } from '@/shared/lib/datetime-local';
import type { NewsItemFormValues } from '../model/news-form-schema';

export function NewsItemPublicationFields() {
  const { t } = useTranslation();
  const { register, control, formState, getValues, setValue } = useFormContext<NewsItemFormValues>();
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
            id="news-published"
            checked={field.value}
            onCheckedChange={(checked) => {
              field.onChange(checked);
              if (checked && getValues('publishedAt') === '') {
                setValue('publishedAt', toDateTimeLocalValue(new Date().toISOString()), { shouldDirty: true });
              }
            }}
            publishedText={t('admin.news.fields.publishedText')}
            draftText={t('admin.news.fields.draftText')}
          />
        )}
      />
      <Controller
        control={control}
        name="isPromo"
        render={({ field }) => (
          <label
            htmlFor="news-promo"
            className="flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors"
          >
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="font-medium">{t('admin.news.fields.isPromo')}</span>
              <span className="text-sm text-muted-foreground">{t('admin.news.fields.isPromoHint')}</span>
            </span>
            <Switch id="news-promo" checked={field.value} onCheckedChange={field.onChange} />
          </label>
        )}
      />
      <Field>
        <FieldLabel htmlFor="news-published-at">{t('admin.news.fields.publishedAt')}</FieldLabel>
        <Input id="news-published-at" type="datetime-local" className="sm:max-w-xs" {...register('publishedAt')} />
        <FieldDescription>{t('admin.news.fields.publishedAtHint')}</FieldDescription>
      </Field>
      <SeoFields
        idPrefix="news"
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
