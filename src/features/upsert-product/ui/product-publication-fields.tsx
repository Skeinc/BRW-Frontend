import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PublishCard } from '@/shared/ui/publish-card';
import { Switch } from '@/shared/ui/switch';
import { SeoFields } from '@/shared/ui/seo-fields';
import type { ProductFormValues } from '../model/product-form-schema';

export function ProductPublicationFields() {
  const { t } = useTranslation();
  const { register, control, formState } = useFormContext<ProductFormValues>();
  const [name, seoTitle, seoDescription, description] = useWatch({
    control,
    name: ['name', 'seoTitle', 'seoDescription', 'description'],
  });

  return (
    <>
      <Controller
        control={control}
        name="isPublished"
        render={({ field }) => (
          <PublishCard
            id="product-published"
            checked={field.value}
            onCheckedChange={field.onChange}
            publishedText={t('admin.products.fields.publishedText')}
            draftText={t('admin.products.fields.draftText')}
          />
        )}
      />
      <Controller
        control={control}
        name="isHit"
        render={({ field }) => (
          <label
            htmlFor="product-hit"
            className="flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors"
          >
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="font-medium">{t('admin.products.fields.hit')}</span>
              <span className="text-sm text-muted-foreground">{t('admin.products.fields.hitText')}</span>
            </span>
            <Switch id="product-hit" checked={field.value} onCheckedChange={field.onChange} />
          </label>
        )}
      />
      <SeoFields
        idPrefix="product"
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
