import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PublishCard } from '@/shared/ui/publish-card';
import type { SlideFormValues } from '../model/slide-form-schema';

export function SlidePublicationFields() {
  const { t } = useTranslation();
  const { control } = useFormContext<SlideFormValues>();

  return (
    <Controller
      control={control}
      name="isPublished"
      render={({ field }) => (
        <PublishCard
          id="slide-published"
          checked={field.value}
          onCheckedChange={field.onChange}
          publishedText={t('admin.slides.fields.publishedText')}
          draftText={t('admin.slides.fields.draftText')}
        />
      )}
    />
  );
}
