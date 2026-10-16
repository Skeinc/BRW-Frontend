import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { Category, CategoryDetail } from '@/entities/category';
import { PublicationBadge } from '@/shared/ui/publication-badge';
import { DiscardChangesDialog } from '@/shared/ui/discard-changes-dialog';
import { EditorDialog } from '@/shared/ui/editor-dialog';
import { CategoryForm } from './category-form';

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The category being edited; null while creating. */
  category: Category | null;
  /** Called after a save, so the page can keep the dialog open on a new category and show its photo. */
  onSaved: (saved: CategoryDetail, wasCreated: boolean) => void;
  /** Photo block, rendered only for an existing category. */
  gallery?: ReactNode;
}

export function CategoryFormDialog({ open, onOpenChange, category, onSaved, gallery }: CategoryFormDialogProps) {
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
        title={category?.name ?? t('admin.categories.createTitle')}
        subtitle={
          category
            ? t('admin.categories.editSubtitle', {
                level: category.depth,
                children: category.childCount,
                products: category.productCount,
              })
            : t('admin.categories.formDescription')
        }
        badge={category ? <PublicationBadge isPublished={category.isPublished} /> : null}
      >
        <CategoryForm
          key={category?.id ?? 'new'}
          category={category}
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
