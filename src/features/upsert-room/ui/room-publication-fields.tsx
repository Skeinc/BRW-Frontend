import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PublishCard } from '@/shared/ui/publish-card';
import { SeoFields } from '@/shared/ui/seo-fields';
import type { RoomFormValues } from '../model/room-form-schema';

export function RoomPublicationFields() {
  const { t } = useTranslation();
  const { register, control, formState } = useFormContext<RoomFormValues>();
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
            id="room-published"
            checked={field.value}
            onCheckedChange={field.onChange}
            publishedText={t('admin.rooms.fields.publishedText')}
            draftText={t('admin.rooms.fields.draftText')}
          />
        )}
      />
      <SeoFields
        idPrefix="room"
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
