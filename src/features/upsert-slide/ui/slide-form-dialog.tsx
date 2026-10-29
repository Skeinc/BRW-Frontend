import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { Slide, SlideDetail } from '@/entities/slide';
import { DiscardChangesDialog } from '@/shared/ui/discard-changes-dialog';
import { EditorDialog } from '@/shared/ui/editor-dialog';
import { PublicationBadge } from '@/shared/ui/publication-badge';
import { SlideForm } from './slide-form';

interface SlideFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The slide being edited; null while creating. */
  slide: Slide | null;
  /** Called after a save, so the page can keep the dialog open on a new slide and show its picture. */
  onSaved: (saved: SlideDetail, wasCreated: boolean) => void;
  /** Picture block, rendered only for an existing slide. */
  gallery?: ReactNode;
}

export function SlideFormDialog({ open, onOpenChange, slide, onSaved, gallery }: SlideFormDialogProps) {
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
        title={slide?.alt ?? t('admin.slides.createTitle')}
        subtitle={slide ? t('admin.slides.editTitle') : t('admin.slides.formDescription')}
        badge={slide ? <PublicationBadge isPublished={slide.isPublished} /> : null}
      >
        <SlideForm
          key={slide?.id ?? 'new'}
          slide={slide}
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
