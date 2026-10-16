import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  collectionsQueryKey,
  createCollection,
  updateCollection,
  type Collection,
  type CollectionDetail,
  type CollectionInput,
} from '@/entities/collection';
import { ApiError, getApiErrorMessage } from '@/shared/api';
import { emptyToNull } from '@/shared/lib/form/empty-to-null';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { RequiredMark } from '@/shared/ui/required-mark';
import { Switch } from '@/shared/ui/switch';
import { Textarea } from '@/shared/ui/textarea';
import { collectionFormSchema, type CollectionFormValues } from '../model/collection-form-schema';

const FORM_ID = 'collection-form';

interface CollectionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The collection being edited; null while creating. */
  collection: Collection | null;
  /** Called after a save, so the page can keep the dialog open on the new collection and show its photos. */
  onSaved: (saved: CollectionDetail, wasCreated: boolean) => void;
  /** Photos block, rendered only for an existing collection. */
  gallery?: ReactNode;
}

function toDefaultValues(collection: Collection | null): CollectionFormValues {
  return {
    name: collection?.name ?? '',
    description: collection?.description ?? '',
    seoTitle: collection?.seoTitle ?? '',
    seoDescription: collection?.seoDescription ?? '',
    isPublished: collection?.isPublished ?? true,
  };
}

/** The address (slug) and the sort order are not asked from the user: the API builds the address from the name and appends new items. */
function toInput(values: CollectionFormValues): CollectionInput {
  return {
    name: values.name.trim(),
    description: emptyToNull(values.description),
    seoTitle: emptyToNull(values.seoTitle),
    seoDescription: emptyToNull(values.seoDescription),
    isPublished: values.isPublished,
  };
}

export function CollectionFormDialog({ open, onOpenChange, collection, onSaved, gallery }: CollectionFormDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: toDefaultValues(collection),
  });
  const errors = form.formState.errors;

  const save = useMutation({
    mutationFn: (values: CollectionFormValues) =>
      collection ? updateCollection(collection.id, toInput(values)) : createCollection(toInput(values)),
    onSuccess: async (saved) => {
      await queryClient.invalidateQueries({ queryKey: collectionsQueryKey });
      toast.success(t(collection ? 'admin.collections.updated' : 'admin.collections.created'));
      onSaved(saved, collection === null);
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
          <DialogTitle>{t(collection ? 'admin.collections.editTitle' : 'admin.collections.createTitle')}</DialogTitle>
          <DialogDescription>{t('admin.collections.formDescription')}</DialogDescription>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-6 py-5">
          <form id={FORM_ID} noValidate onSubmit={form.handleSubmit((values) => save.mutate(values))}>
            <FieldGroup>
              <Field data-invalid={!!errors.name || undefined}>
                <FieldLabel htmlFor="collection-name">
                  {t('admin.collections.fields.name')}
                  <RequiredMark />
                </FieldLabel>
                <Input
                  id="collection-name"
                  autoComplete="off"
                  aria-required
                  aria-invalid={!!errors.name || undefined}
                  {...form.register('name')}
                />
                <FieldError errors={[translateFieldError(errors.name, t)]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="collection-description">{t('admin.collections.fields.description')}</FieldLabel>
                <Textarea id="collection-description" className="min-h-28" {...form.register('description')} />
              </Field>
              <Field data-invalid={!!errors.seoTitle || undefined}>
                <FieldLabel htmlFor="collection-seo-title">{t('admin.collections.fields.seoTitle')}</FieldLabel>
                <Input
                  id="collection-seo-title"
                  autoComplete="off"
                  aria-invalid={!!errors.seoTitle || undefined}
                  {...form.register('seoTitle')}
                />
                <FieldError errors={[translateFieldError(errors.seoTitle, t)]} />
              </Field>
              <Field data-invalid={!!errors.seoDescription || undefined}>
                <FieldLabel htmlFor="collection-seo-description">
                  {t('admin.collections.fields.seoDescription')}
                </FieldLabel>
                <Textarea
                  id="collection-seo-description"
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
                    <Switch id="collection-published" checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
                <FieldLabel htmlFor="collection-published">{t('admin.common.published')}</FieldLabel>
              </Field>
            </FieldGroup>
          </form>
          {collection ? gallery : <p className="text-sm text-muted-foreground">{t('admin.gallery.saveFirst')}</p>}
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
