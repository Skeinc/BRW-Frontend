import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  categoriesQueryKey,
  createCategory,
  categoryTreeQueryOptions,
  getParentOptions,
  updateCategory,
  type Category,
  type CategoryDetail,
  type CategoryInput,
} from '@/entities/category';
import { ApiError, getApiErrorMessage } from '@/shared/api';
import { emptyToNull } from '@/shared/lib/form/empty-to-null';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { RequiredMark } from '@/shared/ui/required-mark';
import { Switch } from '@/shared/ui/switch';
import { Textarea } from '@/shared/ui/textarea';
import { categoryFormSchema, ROOT_PARENT_VALUE, type CategoryFormValues } from '../model/category-form-schema';

const FORM_ID = 'category-form';

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The category being edited; null while creating. */
  category: Category | null;
  /** Called after a save, so the page can keep the dialog open on the new category and show its photos. */
  onSaved: (saved: CategoryDetail, wasCreated: boolean) => void;
  /** Photos block, rendered only for an existing category. */
  gallery?: ReactNode;
}

function toDefaultValues(category: Category | null): CategoryFormValues {
  return {
    name: category?.name ?? '',
    parentId: category?.parentId ?? ROOT_PARENT_VALUE,
    description: category?.description ?? '',
    seoTitle: category?.seoTitle ?? '',
    seoDescription: category?.seoDescription ?? '',
    isPublished: category?.isPublished ?? true,
  };
}

/** The address (slug) and the sort order are not asked from the user: the API builds the address from the name and appends new items. */
function toInput(values: CategoryFormValues): CategoryInput {
  const parentId = values.parentId === ROOT_PARENT_VALUE ? null : values.parentId;
  return {
    name: values.name.trim(),
    parentId,
    description: emptyToNull(values.description),
    seoTitle: emptyToNull(values.seoTitle),
    seoDescription: emptyToNull(values.seoDescription),
    isPublished: values.isPublished,
  };
}

export function CategoryFormDialog({ open, onOpenChange, category, onSaved, gallery }: CategoryFormDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: toDefaultValues(category),
  });
  const errors = form.formState.errors;
  const treeQuery = useQuery(categoryTreeQueryOptions);
  const parentOptions = getParentOptions(treeQuery.data ?? [], category);

  const save = useMutation({
    mutationFn: (values: CategoryFormValues) =>
      category ? updateCategory(category.id, toInput(values)) : createCategory(toInput(values)),
    onSuccess: async (saved) => {
      await queryClient.invalidateQueries({ queryKey: categoriesQueryKey });
      toast.success(t(category ? 'admin.categories.updated' : 'admin.categories.created'));
      onSaved(saved, category === null);
    },
    onError: (error) => {
      if (error instanceof ApiError && error.code === 'SLUG_TAKEN') {
        form.setError('name', { message: 'admin.validation.nameTaken' });
      }
    },
  });
  const serverError =
    save.isError && !(save.error instanceof ApiError && save.error.code === 'SLUG_TAKEN')
      ? getApiErrorMessage(save.error, t)
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90svh] flex-col gap-0 p-0 sm:max-w-2xl">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>{t(category ? 'admin.categories.editTitle' : 'admin.categories.createTitle')}</DialogTitle>
          <DialogDescription>{t('admin.categories.formDescription')}</DialogDescription>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-6 py-5">
          <form id={FORM_ID} noValidate onSubmit={form.handleSubmit((values) => save.mutate(values))}>
            <FieldGroup>
              <Field data-invalid={!!errors.name || undefined}>
                <FieldLabel htmlFor="category-name">
                  {t('admin.categories.fields.name')}
                  <RequiredMark />
                </FieldLabel>
                <Input
                  id="category-name"
                  autoComplete="off"
                  aria-required
                  aria-invalid={!!errors.name || undefined}
                  {...form.register('name')}
                />
                <FieldError errors={[translateFieldError(errors.name, t)]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="category-parent">{t('admin.categories.fields.parent')}</FieldLabel>
                <Controller
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="category-parent" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ROOT_PARENT_VALUE}>{t('admin.categories.fields.noParent')}</SelectItem>
                        {parentOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {'— '.repeat(option.depth - 1)}
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldDescription>{t('admin.categories.fields.parentHint')}</FieldDescription>
              </Field>
              <Field data-invalid={!!errors.description || undefined}>
                <FieldLabel htmlFor="category-description">{t('admin.categories.fields.description')}</FieldLabel>
                <Textarea id="category-description" className="min-h-28" {...form.register('description')} />
              </Field>
              <Field data-invalid={!!errors.seoTitle || undefined}>
                <FieldLabel htmlFor="category-seo-title">{t('admin.categories.fields.seoTitle')}</FieldLabel>
                <Input
                  id="category-seo-title"
                  autoComplete="off"
                  aria-invalid={!!errors.seoTitle || undefined}
                  {...form.register('seoTitle')}
                />
                <FieldError errors={[translateFieldError(errors.seoTitle, t)]} />
              </Field>
              <Field data-invalid={!!errors.seoDescription || undefined}>
                <FieldLabel htmlFor="category-seo-description">
                  {t('admin.categories.fields.seoDescription')}
                </FieldLabel>
                <Textarea
                  id="category-seo-description"
                  aria-invalid={!!errors.seoDescription || undefined}
                  {...form.register('seoDescription')}
                />
                <FieldError errors={[translateFieldError(errors.seoDescription, t)]} />
              </Field>
              <Field orientation="horizontal">
                <Controller
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <Switch id="category-published" checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
                <FieldLabel htmlFor="category-published">{t('admin.common.published')}</FieldLabel>
              </Field>
            </FieldGroup>
          </form>
          {category ? gallery : <p className="text-sm text-muted-foreground">{t('admin.gallery.saveFirst')}</p>}
        </div>
        <DialogFooter className="items-center border-t px-6 py-4 sm:justify-between">
          <p role="alert" className="text-sm text-destructive">
            {serverError}
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('admin.common.close')}
            </Button>
            <Button type="submit" form={FORM_ID} loading={save.isPending}>
              {t('admin.common.save')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
