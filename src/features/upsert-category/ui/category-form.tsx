import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Globe, ImagePlus, Images, Info } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  categoriesQueryKey,
  createCategory,
  updateCategory,
  type Category,
  type CategoryDetail,
} from '@/entities/category';
import { ApiError, getApiErrorMessage } from '@/shared/api';
import { EditorFooter } from '@/shared/ui/editor-footer';
import { EditorSections, type EditorSection } from '@/shared/ui/editor-sections';
import { categoryFormSchema, type CategoryFormValues } from '../model/category-form-schema';
import { toDefaultValues, toInput } from '../model/category-form-values';
import { CategoryMainFields } from './category-main-fields';
import { CategoryPublicationFields } from './category-publication-fields';

interface CategoryFormProps {
  /** The category being edited; null while creating. */
  category: Category | null;
  jumpTo?: { id: string; key: number };
  onDirtyChange: (isDirty: boolean) => void;
  /** Called after a save: a new category keeps the dialog open for its photo, an edited one closes it. */
  onSaved: (saved: CategoryDetail, wasCreated: boolean) => void;
  onClose: () => void;
  /** Photo block of an existing category. */
  gallery: ReactNode;
}

export function CategoryForm({ category, jumpTo, onDirtyChange, onSaved, onClose, gallery }: CategoryFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: toDefaultValues(category),
  });
  const { isDirty } = form.formState;

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (!category) {
      form.setFocus('name');
    }
  }, [form, category]);

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
  const isFieldError = save.error instanceof ApiError && save.error.code === 'SLUG_TAKEN';
  const serverError = save.isError && !isFieldError ? getApiErrorMessage(save.error, t) : null;

  const sections: EditorSection[] = [
    {
      id: 'main',
      title: t('admin.categories.sections.main'),
      description: t('admin.categories.sections.mainHint'),
      icon: Info,
      content: <CategoryMainFields category={category} />,
    },
    {
      id: 'photo',
      title: t('admin.categories.sections.photo'),
      description: t('admin.categories.sections.photoHint'),
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
      title: t('admin.categories.sections.publication'),
      description: t('admin.categories.sections.publicationHint'),
      icon: Globe,
      content: <CategoryPublicationFields />,
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
