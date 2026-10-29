import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Boxes, Globe, ImagePlus, Images, Info } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { createSolution, solutionsQueryKey, updateSolution, type SolutionDetail } from '@/entities/solution';
import { getApiErrorMessage } from '@/shared/api';
import { EditorFooter } from '@/shared/ui/editor-footer';
import { EditorSections, type EditorSection } from '@/shared/ui/editor-sections';
import { solutionFormSchema, type SolutionFormValues } from '../model/solution-form-schema';
import { toDefaultValues, toInput } from '../model/solution-form-values';
import { SolutionMainFields } from './solution-main-fields';
import { SolutionProductsField } from './solution-products-field';
import { SolutionPublicationFields } from './solution-publication-fields';

interface SolutionFormProps {
  /** The solution being edited with its elements; null while creating. */
  solution: SolutionDetail | null;
  /** Filled from a list row when creating from a filtered list. */
  presetRoomId?: string;
  jumpTo?: { id: string; key: number };
  onDirtyChange: (isDirty: boolean) => void;
  /** Called after a save: a new solution keeps the dialog open for its photo, an edited one closes it. */
  onSaved: (saved: SolutionDetail, wasCreated: boolean) => void;
  onClose: () => void;
  /** Photo block of an existing solution. */
  gallery: ReactNode;
}

export function SolutionForm({
  solution,
  presetRoomId,
  jumpTo,
  onDirtyChange,
  onSaved,
  onClose,
  gallery,
}: SolutionFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const form = useForm<SolutionFormValues>({
    resolver: zodResolver(solutionFormSchema),
    defaultValues: { ...toDefaultValues(solution), roomId: solution?.roomId ?? presetRoomId ?? '' },
  });
  const { isDirty } = form.formState;

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (!solution) {
      form.setFocus('name');
    }
  }, [form, solution]);

  const save = useMutation({
    mutationFn: (values: SolutionFormValues) =>
      solution ? updateSolution(solution.id, toInput(values)) : createSolution(toInput(values)),
    onSuccess: async (saved) => {
      await queryClient.invalidateQueries({ queryKey: solutionsQueryKey });
      toast.success(t(solution ? 'admin.solutions.updated' : 'admin.solutions.created'));
      onSaved(saved, solution === null);
    },
  });
  const serverError = save.isError ? getApiErrorMessage(save.error, t) : null;

  const sections: EditorSection[] = [
    {
      id: 'main',
      title: t('admin.solutions.sections.main'),
      description: t('admin.solutions.sections.mainHint'),
      icon: Info,
      content: <SolutionMainFields />,
    },
    {
      id: 'elements',
      title: t('admin.solutions.sections.elements'),
      description: t('admin.solutions.sections.elementsHint'),
      icon: Boxes,
      content: <SolutionProductsField />,
    },
    {
      id: 'photo',
      title: t('admin.solutions.sections.photo'),
      description: t('admin.solutions.sections.photoHint'),
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
      title: t('admin.solutions.sections.publication'),
      description: t('admin.solutions.sections.publicationHint'),
      icon: Globe,
      content: <SolutionPublicationFields />,
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
