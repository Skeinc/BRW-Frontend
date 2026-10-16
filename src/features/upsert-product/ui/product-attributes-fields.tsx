import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { Button } from '@/shared/ui/button';
import { FieldError } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { ATTRIBUTE_SUGGESTIONS } from '../model/product-sections';
import type { ProductFormValues } from '../model/product-form-schema';

/** Editable list of name and value pairs, with one-click suggestions for the common ones. */
export function ProductAttributesFields() {
  const { t } = useTranslation();
  const { register, control, formState } = useFormContext<ProductFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'attributes' });
  const rows = useWatch({ control, name: 'attributes' });
  const usedKeys = new Set(rows.map((row) => row.key.trim().toLowerCase()));
  const suggestions = ATTRIBUTE_SUGGESTIONS.filter((name) => !usedKeys.has(name.toLowerCase()));

  return (
    <>
      {suggestions.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">{t('admin.products.fields.attributeSuggestions')}</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((name) => (
              <Button
                key={name}
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => append({ key: name, value: '' })}
              >
                <Plus aria-hidden />
                {name}
              </Button>
            ))}
          </div>
        </div>
      ) : null}
      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <Input
                aria-label={t('admin.products.fields.attributeKey')}
                placeholder={t('admin.products.fields.attributeKey')}
                aria-invalid={!!formState.errors.attributes?.[index]?.key || undefined}
                {...register(`attributes.${index}.key`)}
              />
              <Input
                aria-label={t('admin.products.fields.attributeValue')}
                placeholder={t('admin.products.fields.attributeValue')}
                {...register(`attributes.${index}.value`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-10 shrink-0 text-muted-foreground hover:text-destructive"
                aria-label={t('admin.products.fields.attributeRemove')}
                onClick={() => remove(index)}
              >
                <Trash2 aria-hidden />
              </Button>
            </div>
            <FieldError errors={[translateFieldError(formState.errors.attributes?.[index]?.key, t)]} />
          </div>
        ))}
        {fields.length === 0 ? (
          <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
            {t('admin.products.fields.attributesEmpty')}
          </p>
        ) : null}
        <Button type="button" variant="outline" className="w-fit" onClick={() => append({ key: '', value: '' })}>
          <Plus aria-hidden />
          {t('admin.products.fields.attributeAdd')}
        </Button>
      </div>
    </>
  );
}
