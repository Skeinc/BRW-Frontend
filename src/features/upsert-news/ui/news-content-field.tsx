import { Bold, Eye, Heading2, ImagePlus, Italic, Link2, List, Pencil, type LucideIcon } from 'lucide-react';
import { lazy, Suspense, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { GALLERY_ACCEPTED_TYPES, GALLERY_MAX_FILE_BYTES, uploadContentImage } from '@/entities/media';
import { getApiErrorMessage } from '@/shared/api';
import { cn } from '@/shared/lib/utils';
import { translateFieldError } from '@/shared/lib/form/translate-field-error';
import { Button } from '@/shared/ui/button';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/shared/ui/field';
import { RequiredMark } from '@/shared/ui/required-mark';
import { Skeleton } from '@/shared/ui/skeleton';
import { Textarea } from '@/shared/ui/textarea';
import { applyMarkdown, type MarkdownAction } from '../model/apply-markdown';
import type { NewsItemFormValues } from '../model/news-form-schema';

const FORMAT_BUTTONS: readonly { action: MarkdownAction; icon: LucideIcon; labelKey: string }[] = [
  { action: 'heading', icon: Heading2, labelKey: 'admin.news.format.heading' },
  { action: 'bold', icon: Bold, labelKey: 'admin.news.format.bold' },
  { action: 'italic', icon: Italic, labelKey: 'admin.news.format.italic' },
  { action: 'list', icon: List, labelKey: 'admin.news.format.list' },
  { action: 'link', icon: Link2, labelKey: 'admin.news.format.link' },
];

/** The Markdown renderer is only loaded when the preview is opened. */
const NewsItemPreview = lazy(() => import('./news-preview'));

function isAcceptedImage(file: File): boolean {
  return (GALLERY_ACCEPTED_TYPES as readonly string[]).includes(file.type) && file.size <= GALLERY_MAX_FILE_BYTES;
}

/** News item body (Markdown or HTML) with a formatting bar and a button that uploads an image and pastes it at the cursor. */
export function NewsItemContentField() {
  const { t } = useTranslation();
  const { control, formState, getValues } = useFormContext<NewsItemFormValues>();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const error = formState.errors.content;

  const restoreSelection = (start: number, end: number) =>
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(start, end);
    });

  const format = (action: MarkdownAction, value: string, onChange: (next: string) => void) => {
    const element = textareaRef.current;
    const result = applyMarkdown(action, {
      value,
      start: element?.selectionStart ?? value.length,
      end: element?.selectionEnd ?? value.length,
    });
    onChange(result.value);
    restoreSelection(result.start, result.end);
  };

  const uploadAndInsert = async (file: File, onChange: (next: string) => void) => {
    if (!isAcceptedImage(file)) {
      toast.error(t('api.errors.IMAGE_INVALID'));
      return;
    }
    setProgress(0);
    try {
      const image = await uploadContentImage(file, setProgress);
      const current = getValues('content');
      const start = textareaRef.current?.selectionStart ?? current.length;
      const end = textareaRef.current?.selectionEnd ?? start;
      const before = current.slice(0, start);
      const inserted = `${before === '' || before.endsWith('\n') ? '' : '\n'}![](${image.url})\n`;
      onChange(before + inserted + current.slice(end));
      restoreSelection((before + inserted).length, (before + inserted).length);
    } catch (uploadError) {
      toast.error(getApiErrorMessage(uploadError, t));
    } finally {
      setProgress(null);
    }
  };

  return (
    <Controller
      control={control}
      name="content"
      render={({ field }) => (
        <Field data-invalid={!!error || undefined}>
          <FieldLabel htmlFor="news-content">
            {t('admin.news.fields.content')}
            <RequiredMark />
          </FieldLabel>
          <div className="overflow-hidden rounded-lg border focus-within:ring-[3px] focus-within:ring-ring/50">
            <div className="flex flex-wrap items-center gap-1 border-b bg-muted/40 p-1.5">
              <div
                role="tablist"
                aria-label={t('admin.news.fields.content')}
                className="mr-1 flex rounded-lg bg-muted p-0.5"
              >
                {(['edit', 'preview'] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    role="tab"
                    aria-selected={mode === value}
                    className={cn(
                      'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors',
                      mode === value && 'bg-background text-foreground shadow-xs',
                    )}
                    onClick={() => setMode(value)}
                  >
                    {value === 'edit' ? (
                      <Pencil className="size-3.5" aria-hidden />
                    ) : (
                      <Eye className="size-3.5" aria-hidden />
                    )}
                    {t(`admin.news.preview.${value}`)}
                  </button>
                ))}
              </div>
              {mode === 'edit' ? (
                <>
                  {FORMAT_BUTTONS.map(({ action, icon: Icon, labelKey }) => (
                    <Button
                      key={action}
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-9"
                      aria-label={t(labelKey)}
                      title={t(labelKey)}
                      onClick={() => format(action, field.value, field.onChange)}
                    >
                      <Icon aria-hidden />
                    </Button>
                  ))}
                  <span className="mx-1 h-5 w-px bg-border" aria-hidden />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    loading={progress !== null}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus aria-hidden />
                    {progress === null ? t('admin.news.fields.insertImage') : `${progress}%`}
                  </Button>
                </>
              ) : null}
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept={GALLERY_ACCEPTED_TYPES.join(',')}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = '';
                  if (file) {
                    void uploadAndInsert(file, field.onChange);
                  }
                }}
              />
            </div>
            {mode === 'preview' ? (
              <Suspense fallback={<Skeleton className="m-5 h-48" />}>
                <NewsItemPreview content={field.value} />
              </Suspense>
            ) : null}
            <Textarea
              id="news-content"
              ref={(element) => {
                field.ref(element);
                textareaRef.current = element;
              }}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              aria-required
              aria-invalid={!!error || undefined}
              placeholder={t('admin.news.fields.contentPlaceholder')}
              className={cn(
                'min-h-72 rounded-none border-0 font-mono text-sm shadow-none focus-visible:ring-0',
                mode === 'preview' && 'hidden',
              )}
            />
          </div>
          <FieldDescription>
            {t('admin.news.fields.contentHint')}{' '}
            <span className="tabular-nums">
              {t('admin.news.fields.words', {
                count: field.value.trim() ? field.value.trim().split(/\s+/).length : 0,
              })}
            </span>
          </FieldDescription>
          <FieldError errors={[translateFieldError(error, t)]} />
        </Field>
      )}
    />
  );
}
