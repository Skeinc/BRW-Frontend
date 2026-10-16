import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PublishCard } from '@/shared/ui/publish-card';
import { SeoFields } from '@/shared/ui/seo-fields';
import type { CollectionFormValues } from '../model/collection-form-schema';

export function CollectionPublicationFields() {
  const { t } = useTranslation();
  const { register, control, formState } = useFormContext<CollectionFormValues>();
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
            id="collection-published"
            checked={field.value}
            onCheckedChange={field.onChange}
            publishedText={t('admin.collections.fields.publishedText')}
            draftText={t('admin.collections.fields.draftText')}
          />
        )}
      />
      <SeoFields
        idPrefix="collection"
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
