import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Globe, ImagePlus, Images, Info } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { createSlide, slidesQueryKey, updateSlide, type Slide, type SlideDetail } from '@/entities/slide';
import { getApiErrorMessage } from '@/shared/api';
import { EditorFooter } from '@/shared/ui/editor-footer';
import { EditorSections, type EditorSection } from '@/shared/ui/editor-sections';
import { slideFormSchema, type SlideFormValues } from '../model/slide-form-schema';
import { toDefaultValues, toInput } from '../model/slide-form-values';
import { SlideMainFields } from './slide-main-fields';
import { SlidePublicationFields } from './slide-publication-fields';

interface SlideFormProps {
  /** The slide being edited; null while creating. */
  slide: Slide | null;
  jumpTo?: { id: string; key: number };
  onDirtyChange: (isDirty: boolean) => void;
  /** Called after a save: a new slide keeps the dialog open for its picture, an edited one closes it. */
  onSaved: (saved: SlideDetail, wasCreated: boolean) => void;
  onClose: () => void;
  /** Picture block of an existing slide. */
  gallery: ReactNode;
}

export function SlideForm({ slide, jumpTo, onDirtyChange, onSaved, onClose, gallery }: SlideFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const form = useForm<SlideFormValues>({
    resolver: zodResolver(slideFormSchema),
    defaultValues: toDefaultValues(slide),
  });
  const { isDirty } = form.formState;

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (!slide) {
      form.setFocus('alt');
    }
  }, [form, slide]);

  const save = useMutation({
    mutationFn: (values: SlideFormValues) =>
      slide ? updateSlide(slide.id, toInput(values)) : createSlide(toInput(values)),
    onSuccess: async (saved) => {
      await queryClient.invalidateQueries({ queryKey: slidesQueryKey });
      toast.success(t(slide ? 'admin.slides.updated' : 'admin.slides.created'));
      onSaved(saved, slide === null);
    },
  });
  const serverError = save.isError ? getApiErrorMessage(save.error, t) : null;

  const sections: EditorSection[] = [
    {
      id: 'main',
      title: t('admin.slides.sections.main'),
      description: t('admin.slides.sections.mainHint'),
      icon: Info,
      content: <SlideMainFields />,
    },
    {
      id: 'photo',
      title: t('admin.slides.sections.image'),
      description: t('admin.slides.sections.imageHint'),
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
      title: t('admin.slides.sections.publication'),
      description: t('admin.slides.sections.publicationHint'),
      icon: Globe,
      content: <SlidePublicationFields />,
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
