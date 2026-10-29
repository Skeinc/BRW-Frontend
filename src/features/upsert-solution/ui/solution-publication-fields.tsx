import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PublishCard } from '@/shared/ui/publish-card';
import type { SolutionFormValues } from '../model/solution-form-schema';

export function SolutionPublicationFields() {
  const { t } = useTranslation();
  const { control } = useFormContext<SolutionFormValues>();
  return (
    <Controller
      control={control}
      name="isPublished"
      render={({ field }) => (
        <PublishCard
          id="solution-published"
          checked={field.value}
          onCheckedChange={field.onChange}
          publishedText={t('admin.solutions.fields.publishedText')}
          draftText={t('admin.solutions.fields.draftText')}
        />
      )}
    />
  );
}
