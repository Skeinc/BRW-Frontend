import { useQuery } from '@tanstack/react-query';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { categoryTreeQueryOptions, getParentOptions, type Category } from '@/entities/category';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { RequiredMark } from '@/shared/ui/required-mark';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';
import { ROOT_PARENT_VALUE, type CategoryFormValues } from '../model/category-form-schema';

interface CategoryMainFieldsProps {
  /** The category being edited, so it and its subcategories are not offered as its parent. */
  category: Category | null;
}

export function CategoryMainFields({ category }: CategoryMainFieldsProps) {
  const { t } = useTranslation();
  const { register, control, formState } = useFormContext<CategoryFormValues>();
  const errors = formState.errors;
  const treeQuery = useQuery(categoryTreeQueryOptions);
  const parentOptions = getParentOptions(treeQuery.data ?? [], category);

  return (
    <>
      <Field data-invalid={!!errors.name || undefined}>
        <FieldLabel htmlFor="category-name">
          {t('admin.categories.fields.name')}
          <RequiredMark />
        </FieldLabel>
        <Input
          id="category-name"
          autoComplete="off"
          placeholder={t('admin.categories.fields.namePlaceholder')}
          aria-required
          aria-invalid={!!errors.name || undefined}
          {...register('name')}
        />
        <FieldError errors={[translateFieldError(errors.name, t)]} />
      </Field>
      <Field>
        <FieldLabel htmlFor="category-parent">{t('admin.categories.fields.parent')}</FieldLabel>
        <Controller
          control={control}
          name="parentId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="category-parent" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ROOT_PARENT_VALUE}>{t('admin.categories.fields.noParent')}</SelectItem>
                {parentOptions.map((option) => (
                  <SelectItem
                    key={option.id}
                    value={option.id}
                    style={{ paddingLeft: `${0.5 + (option.depth - 1) * 1.25}rem` }}
                  >
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldDescription>{t('admin.categories.fields.parentHint')}</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="category-description">{t('admin.categories.fields.description')}</FieldLabel>
        <Textarea
          id="category-description"
          className="min-h-28"
          placeholder={t('admin.categories.fields.descriptionPlaceholder')}
          {...register('description')}
        />
      </Field>
    </>
  );
}
