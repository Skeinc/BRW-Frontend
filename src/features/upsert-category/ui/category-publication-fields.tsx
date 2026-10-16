import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PublishCard } from '@/shared/ui/publish-card';
import { SeoFields } from '@/shared/ui/seo-fields';
import type { CategoryFormValues } from '../model/category-form-schema';

export function CategoryPublicationFields() {
  const { t } = useTranslation();
  const { register, control, formState } = useFormContext<CategoryFormValues>();
  const [name, description, seoTitle, seoDescription] = useWatch({
    control,
    name: ['name', 'description', 'seoTitle', 'seoDescription'],
  });

  return (
    <>
      <Controller
        control={control}
        name="isPublished"
        render={({ field }) => (
          <PublishCard
            id="category-published"
            checked={field.value}
            onCheckedChange={field.onChange}
            publishedText={t('admin.categories.fields.publishedText')}
            draftText={t('admin.categories.fields.draftText')}
          />
        )}
      />
      <SeoFields
        idPrefix="category"
        title={{ registration: register('seoTitle'), value: seoTitle, error: formState.errors.seoTitle }}
        description={{
          registration: register('seoDescription'),
          value: seoDescription,
          error: formState.errors.seoDescription,
        }}
        fallbackTitle={name}
        fallbackDescription={description}
      />
    </>
  );
}
