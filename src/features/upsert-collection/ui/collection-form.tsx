import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Globe, ImagePlus, Images, Info } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  collectionsQueryKey,
  createCollection,
  updateCollection,
  type Collection,
  type CollectionDetail,
} from '@/entities/collection';
import { ApiError, getApiErrorMessage } from '@/shared/api';
import { EditorFooter } from '@/shared/ui/editor-footer';
import { EditorSections, type EditorSection } from '@/shared/ui/editor-sections';
import { collectionFormSchema, type CollectionFormValues } from '../model/collection-form-schema';
import { toDefaultValues, toInput } from '../model/collection-form-values';
import { CollectionMainFields } from './collection-main-fields';
import { CollectionPublicationFields } from './collection-publication-fields';

interface CollectionFormProps {
  /** The collection being edited; null while creating. */
  collection: Collection | null;
  jumpTo?: { id: string; key: number };
  onDirtyChange: (isDirty: boolean) => void;
  /** Called after a save: a new collection keeps the dialog open for its photo, an edited one closes it. */
  onSaved: (saved: CollectionDetail, wasCreated: boolean) => void;
  onClose: () => void;
  /** Photo block of an existing collection. */
  gallery: ReactNode;
}

export function CollectionForm({ collection, jumpTo, onDirtyChange, onSaved, onClose, gallery }: CollectionFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: toDefaultValues(collection),
  });
  const { isDirty } = form.formState;

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (!collection) {
      form.setFocus('name');
    }
  }, [form, collection]);

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
  const isFieldError = save.error instanceof ApiError && save.error.code === 'SLUG_TAKEN';
  const serverError = save.isError && !isFieldError ? getApiErrorMessage(save.error, t) : null;

  const sections: EditorSection[] = [
    {
      id: 'main',
      title: t('admin.collections.sections.main'),
      description: t('admin.collections.sections.mainHint'),
      icon: Info,
      content: <CollectionMainFields />,
    },
    {
      id: 'photo',
      title: t('admin.collections.sections.photo'),
      description: t('admin.collections.sections.photoHint'),
      icon: Images,
      content: gallery ?? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-6 text-center">
          <ImagePlus className="size-8 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">{t('admin.gallery.saveFirstLong')}</p>
        </div>
      ),
    },
    {
      id: 'publication',
      title: t('admin.collections.sections.publication'),
      description: t('admin.collections.sections.publicationHint'),
      icon: Globe,
      content: <CollectionPublicationFields />,
    },
  ];

  return (
    <FormProvider {...form}>
      <form
        noValidate
        className="flex min-h-0 flex-1 flex-col"
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
            event.preventDefault();
            event.currentTarget.requestSubmit();
          }
        }}
        onSubmit={form.handleSubmit((values) => save.mutate(values))}
      >
        <EditorSections sections={sections} showMenu={false} jumpTo={jumpTo} />
        <EditorFooter isDirty={isDirty} isPending={save.isPending} error={serverError} onCancel={onClose} />
      </form>
    </FormProvider>
  );
}
