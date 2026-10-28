import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Globe, ImagePlus, Images } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { FormProvider, useForm, type FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { newsItemQueryOptions, newsQueryKey, createNewsItem, updateNewsItem, type NewsItem } from '@/entities/news';
import { ApiError, getApiErrorMessage } from '@/shared/api';
import { EditorFooter } from '@/shared/ui/editor-footer';
import { EditorSections, type EditorSection } from '@/shared/ui/editor-sections';
import { newsItemFormSchema, type NewsItemFormValues } from '../model/news-form-schema';
import { toDefaultValues, toInput } from '../model/news-form-values';
import { NEWS_ITEM_SECTION_FIELDS, NEWS_ITEM_SECTIONS, type NewsItemSection } from '../model/news-sections';
import { NewsItemMainFields } from './news-main-fields';
import { NewsItemPublicationFields } from './news-publication-fields';

interface NewsItemFormProps {
  /** The news item being edited; null while creating. */
  newsItem: NewsItem | null;
  /** Scroll to a section, for example the photos right after a news item is created. */
  jumpTo?: { id: string; key: number };
  onJump: (section: NewsItemSection) => void;
  onDirtyChange: (isDirty: boolean) => void;
  /** Called after a save: a new news item keeps the dialog open for its photos, an edited one closes it. */
  onSaved: (saved: NewsItem, wasCreated: boolean) => void;
  onClose: () => void;
  /** Photos block of an existing news item. */
  gallery: ReactNode;
}

function findSectionWithError(errors: FieldErrors<NewsItemFormValues>): NewsItemSection | undefined {
  return NEWS_ITEM_SECTIONS.find((section) => NEWS_ITEM_SECTION_FIELDS[section].some((field) => field in errors));
}

export function NewsItemForm({
  newsItem,
  jumpTo,
  onJump,
  onDirtyChange,
  onSaved,
  onClose,
  gallery,
}: NewsItemFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const form = useForm<NewsItemFormValues>({
    resolver: zodResolver(newsItemFormSchema),
    defaultValues: toDefaultValues(newsItem),
  });
  const { errors, isDirty } = form.formState;

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (!newsItem) {
      form.setFocus('title');
    }
  }, [form, newsItem]);

  const save = useMutation({
    mutationFn: (values: NewsItemFormValues) =>
      newsItem ? updateNewsItem(newsItem.id, toInput(values, newsItem)) : createNewsItem(toInput(values, null)),
    onSuccess: async (saved) => {
      queryClient.setQueryData(newsItemQueryOptions(saved.id).queryKey, saved);
      await queryClient.invalidateQueries({ queryKey: newsQueryKey });
      toast.success(t(newsItem ? 'admin.news.updated' : 'admin.news.created'));
      onSaved(saved, newsItem === null);
    },
    onError: (error) => {
      if (error instanceof ApiError && error.code === 'SLUG_TAKEN') {
        form.setError('title', { message: 'admin.validation.nameTaken' });
        onJump('content');
      }
    },
  });
  const isFieldError = save.error instanceof ApiError && save.error.code === 'SLUG_TAKEN';
  const serverError = save.isError && !isFieldError ? getApiErrorMessage(save.error, t) : null;
  const hasError = (section: NewsItemSection) => NEWS_ITEM_SECTION_FIELDS[section].some((field) => field in errors);

  const sections: EditorSection[] = [
    {
      id: 'content',
      title: t('admin.news.sections.main'),
      description: t('admin.news.sections.mainHint'),
      icon: FileText,
      hasError: hasError('content'),
      content: <NewsItemMainFields />,
    },
    {
      id: 'photos',
      title: t('admin.news.sections.photos'),
      description: t('admin.news.sections.photosHint'),
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
      title: t('admin.news.sections.publication'),
      description: t('admin.news.sections.publicationHint'),
      icon: Globe,
      hasError: hasError('publication'),
      content: <NewsItemPublicationFields />,
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
        onSubmit={form.handleSubmit(
          (values) => save.mutate(values),
          (invalid) => {
            const firstSection = findSectionWithError(invalid);
            if (firstSection) {
              onJump(firstSection);
            }
          },
        )}
      >
        <EditorSections sections={sections} jumpTo={jumpTo} />
        <EditorFooter isDirty={isDirty} isPending={save.isPending} error={serverError} onCancel={onClose} />
      </form>
    </FormProvider>
  );
}
