import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { articleQueryOptions } from '@/entities/article';
import { getApiErrorMessage } from '@/shared/api';
import { PublicationBadge } from '@/shared/ui/publication-badge';
import { DiscardChangesDialog } from '@/shared/ui/discard-changes-dialog';
import { EditorDialog } from '@/shared/ui/editor-dialog';
import { Skeleton } from '@/shared/ui/skeleton';
import type { ArticleSection } from '../model/article-sections';
import { ArticleForm } from './article-form';

const NEW_ARTICLE = 'new';

interface ArticleFormDialogProps {
  /** `'new'` to create, the id of an article to edit, `null` while the dialog is closed. */
  target: string | null;
  onClose: () => void;
  /** Called with the id of an article just created, so the screen can keep the dialog open on it. */
  onCreated: (articleId: string) => void;
  /** The photos block of an existing article, built by the page. */
  renderGallery: (articleId: string) => ReactNode;
}

export function ArticleFormDialog({ target, onClose, onCreated, renderGallery }: ArticleFormDialogProps) {
  const { t } = useTranslation();
  const [jump, setJump] = useState<{ id: string; key: number }>();
  const [isDirty, setIsDirty] = useState(false);
  const [isAskingDiscard, setIsAskingDiscard] = useState(false);
  const articleId = target !== null && target !== NEW_ARTICLE ? target : undefined;
  const articleQuery = useQuery({ ...articleQueryOptions(articleId ?? ''), enabled: articleId !== undefined });
  const article = articleQuery.data ?? null;

  useEffect(() => {
    if (target === null) {
      setJump(undefined);
      setIsDirty(false);
    }
  }, [target]);

  const jumpToSection = (section: ArticleSection) => setJump({ id: section, key: Date.now() });
  const requestClose = () => (isDirty ? setIsAskingDiscard(true) : onClose());

  return (
    <>
      <EditorDialog
        open={target !== null}
        onOpenChange={(open) => !open && requestClose()}
        title={article?.title ?? t(articleId ? 'admin.articles.editTitle' : 'admin.articles.createTitle')}
        subtitle={t('admin.articles.formDescription')}
        badge={article ? <PublicationBadge isPublished={article.isPublished} /> : null}
      >
        {articleId !== undefined && articleQuery.isPending ? (
          <div className="flex flex-col gap-3 p-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : null}
        {articleQuery.isError ? (
          <p role="alert" className="p-6 text-sm text-destructive">
            {getApiErrorMessage(articleQuery.error, t)}
          </p>
        ) : null}
        {target !== null && (articleId === undefined || article) ? (
          <ArticleForm
            key={article?.id ?? NEW_ARTICLE}
            article={article}
            jumpTo={jump}
            onJump={jumpToSection}
            onDirtyChange={setIsDirty}
            onClose={requestClose}
            gallery={article ? renderGallery(article.id) : undefined}
            onSaved={(saved, wasCreated) => {
              setIsDirty(false);
              if (wasCreated) {
                jumpToSection('photos');
                onCreated(saved.id);
              } else {
                onClose();
              }
            }}
          />
        ) : null}
      </EditorDialog>
      <DiscardChangesDialog
        open={isAskingDiscard}
        onKeepEditing={() => setIsAskingDiscard(false)}
        onDiscard={() => {
          setIsAskingDiscard(false);
          setIsDirty(false);
          onClose();
        }}
      />
    </>
  );
}
