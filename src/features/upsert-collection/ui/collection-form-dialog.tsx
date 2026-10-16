import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { Collection, CollectionDetail } from '@/entities/collection';
import { PublicationBadge } from '@/shared/ui/publication-badge';
import { DiscardChangesDialog } from '@/shared/ui/discard-changes-dialog';
import { EditorDialog } from '@/shared/ui/editor-dialog';
import { CollectionForm } from './collection-form';

interface CollectionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The collection being edited; null while creating. */
  collection: Collection | null;
  /** Called after a save, so the page can keep the dialog open on a new collection and show its photo. */
  onSaved: (saved: CollectionDetail, wasCreated: boolean) => void;
  /** Photo block, rendered only for an existing collection. */
  gallery?: ReactNode;
}

export function CollectionFormDialog({ open, onOpenChange, collection, onSaved, gallery }: CollectionFormDialogProps) {
  const { t } = useTranslation();
  const [jump, setJump] = useState<{ id: string; key: number }>();
  const [isDirty, setIsDirty] = useState(false);
  const [isAskingDiscard, setIsAskingDiscard] = useState(false);

  useEffect(() => {
    if (!open) {
      setJump(undefined);
      setIsDirty(false);
    }
  }, [open]);

  const requestClose = () => (isDirty ? setIsAskingDiscard(true) : onOpenChange(false));

  return (
    <>
      <EditorDialog
        open={open}
        onOpenChange={(next) => !next && requestClose()}
        size="narrow"
        title={collection?.name ?? t('admin.collections.createTitle')}
        subtitle={
          collection
            ? t('admin.collections.editSubtitle', { count: collection.productCount })
            : t('admin.collections.formDescription')
        }
        badge={collection ? <PublicationBadge isPublished={collection.isPublished} /> : null}
      >
        <CollectionForm
          key={collection?.id ?? 'new'}
          collection={collection}
          jumpTo={jump}
          onDirtyChange={setIsDirty}
          onClose={requestClose}
          gallery={gallery}
          onSaved={(saved, wasCreated) => {
            setIsDirty(false);
            if (wasCreated) {
              setJump({ id: 'photo', key: Date.now() });
            }
            onSaved(saved, wasCreated);
          }}
        />
      </EditorDialog>
      <DiscardChangesDialog
        open={isAskingDiscard}
        onKeepEditing={() => setIsAskingDiscard(false)}
        onDiscard={() => {
          setIsAskingDiscard(false);
          setIsDirty(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}
