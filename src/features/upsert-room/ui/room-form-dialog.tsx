import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { Room, RoomDetail } from '@/entities/room';
import { PublicationBadge } from '@/shared/ui/publication-badge';
import { DiscardChangesDialog } from '@/shared/ui/discard-changes-dialog';
import { EditorDialog } from '@/shared/ui/editor-dialog';
import { RoomForm } from './room-form';

interface RoomFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The room being edited; null while creating. */
  room: Room | null;
  /** Called after a save, so the page can keep the dialog open on a new room and show its photo. */
  onSaved: (saved: RoomDetail, wasCreated: boolean) => void;
  /** Photo block, rendered only for an existing room. */
  gallery?: ReactNode;
}

export function RoomFormDialog({ open, onOpenChange, room, onSaved, gallery }: RoomFormDialogProps) {
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
        title={room?.name ?? t('admin.rooms.createTitle')}
        subtitle={
          room ? t('admin.rooms.editSubtitle', { count: room.solutionCount }) : t('admin.rooms.formDescription')
        }
        badge={room ? <PublicationBadge isPublished={room.isPublished} /> : null}
      >
        <RoomForm
          key={room?.id ?? 'new'}
          room={room}
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
