import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { newsItemQueryOptions } from '@/entities/news';
import { getApiErrorMessage } from '@/shared/api';
import { PublicationBadge } from '@/shared/ui/publication-badge';
import { DiscardChangesDialog } from '@/shared/ui/discard-changes-dialog';
import { EditorDialog } from '@/shared/ui/editor-dialog';
import { Skeleton } from '@/shared/ui/skeleton';
import type { NewsItemSection } from '../model/news-sections';
import { NewsItemForm } from './news-form';

const NEW_NEWS_ITEM = 'new';

interface NewsFormDialogProps {
  /** `'new'` to create, the id of a news item to edit, `null` while the dialog is closed. */
  target: string | null;
  onClose: () => void;
  /** Called with the id of a news item just created, so the screen can keep the dialog open on it. */
  onCreated: (newsId: string) => void;
  /** The photos block of an existing news item, built by the page. */
  renderGallery: (newsId: string) => ReactNode;
}

export function NewsFormDialog({ target, onClose, onCreated, renderGallery }: NewsFormDialogProps) {
  const { t } = useTranslation();
  const [jump, setJump] = useState<{ id: string; key: number }>();
  const [isDirty, setIsDirty] = useState(false);
  const [isAskingDiscard, setIsAskingDiscard] = useState(false);
  const newsId = target !== null && target !== NEW_NEWS_ITEM ? target : undefined;
  const newsItemQuery = useQuery({ ...newsItemQueryOptions(newsId ?? ''), enabled: newsId !== undefined });
  const newsItem = newsItemQuery.data ?? null;

  useEffect(() => {
    if (target === null) {
      setJump(undefined);
      setIsDirty(false);
    }
  }, [target]);

  const jumpToSection = (section: NewsItemSection) => setJump({ id: section, key: Date.now() });
  const requestClose = () => (isDirty ? setIsAskingDiscard(true) : onClose());

  return (
    <>
      <EditorDialog
        open={target !== null}
        onOpenChange={(open) => !open && requestClose()}
        title={newsItem?.title ?? t(newsId ? 'admin.news.editTitle' : 'admin.news.createTitle')}
        subtitle={t('admin.news.formDescription')}
        badge={newsItem ? <PublicationBadge isPublished={newsItem.isPublished} /> : null}
      >
        {newsId !== undefined && newsItemQuery.isPending ? (
          <div className="flex flex-col gap-3 p-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : null}
        {newsItemQuery.isError ? (
          <p role="alert" className="p-6 text-sm text-destructive">
            {getApiErrorMessage(newsItemQuery.error, t)}
          </p>
        ) : null}
        {target !== null && (newsId === undefined || newsItem) ? (
          <NewsItemForm
            key={newsItem?.id ?? NEW_NEWS_ITEM}
            newsItem={newsItem}
            jumpTo={jump}
            onJump={jumpToSection}
            onDirtyChange={setIsDirty}
            onClose={requestClose}
            gallery={newsItem ? renderGallery(newsItem.id) : undefined}
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
