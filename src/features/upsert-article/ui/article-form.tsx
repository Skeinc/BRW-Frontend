import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Globe, ImagePlus, Images } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { FormProvider, useForm, type FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { articleQueryOptions, articlesQueryKey, createArticle, updateArticle, type Article } from '@/entities/article';
import { ApiError, getApiErrorMessage } from '@/shared/api';
import { EditorFooter } from '@/shared/ui/editor-footer';
import { EditorSections, type EditorSection } from '@/shared/ui/editor-sections';
import { articleFormSchema, type ArticleFormValues } from '../model/article-form-schema';
import { toDefaultValues, toInput } from '../model/article-form-values';
import { ARTICLE_SECTION_FIELDS, ARTICLE_SECTIONS, type ArticleSection } from '../model/article-sections';
import { ArticleMainFields } from './article-main-fields';
import { ArticlePublicationFields } from './article-publication-fields';

interface ArticleFormProps {
  /** The article being edited; null while creating. */
  article: Article | null;
  /** Scroll to a section, for example the photos right after an article is created. */
  jumpTo?: { id: string; key: number };
  onJump: (section: ArticleSection) => void;
  onDirtyChange: (isDirty: boolean) => void;
  /** Called after a save: a new article keeps the dialog open for its photos, an edited one closes it. */
  onSaved: (saved: Article, wasCreated: boolean) => void;
  onClose: () => void;
  /** Photos block of an existing article. */
  gallery: ReactNode;
}

function findSectionWithError(errors: FieldErrors<ArticleFormValues>): ArticleSection | undefined {
  return ARTICLE_SECTIONS.find((section) => ARTICLE_SECTION_FIELDS[section].some((field) => field in errors));
}

export function ArticleForm({ article, jumpTo, onJump, onDirtyChange, onSaved, onClose, gallery }: ArticleFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: toDefaultValues(article),
  });
  const { errors, isDirty } = form.formState;

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (!article) {
      form.setFocus('title');
    }
  }, [form, article]);

  const save = useMutation({
    mutationFn: (values: ArticleFormValues) =>
      article ? updateArticle(article.id, toInput(values, article)) : createArticle(toInput(values, null)),
    onSuccess: async (saved) => {
      queryClient.setQueryData(articleQueryOptions(saved.id).queryKey, saved);
      await queryClient.invalidateQueries({ queryKey: articlesQueryKey });
      toast.success(t(article ? 'admin.articles.updated' : 'admin.articles.created'));
      onSaved(saved, article === null);
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
  const hasError = (section: ArticleSection) => ARTICLE_SECTION_FIELDS[section].some((field) => field in errors);

  const sections: EditorSection[] = [
    {
      id: 'content',
      title: t('admin.articles.sections.main'),
      description: t('admin.articles.sections.mainHint'),
      icon: FileText,
      hasError: hasError('content'),
      content: <ArticleMainFields />,
    },
    {
      id: 'photos',
      title: t('admin.articles.sections.photos'),
      description: t('admin.articles.sections.photosHint'),
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
      title: t('admin.articles.sections.publication'),
      description: t('admin.articles.sections.publicationHint'),
      icon: Globe,
      hasError: hasError('publication'),
      content: <ArticlePublicationFields />,
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
