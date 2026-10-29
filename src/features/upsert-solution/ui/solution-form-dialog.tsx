import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { solutionQueryOptions, type Solution, type SolutionDetail } from '@/entities/solution';
import { DiscardChangesDialog } from '@/shared/ui/discard-changes-dialog';
import { EditorDialog } from '@/shared/ui/editor-dialog';
import { PublicationBadge } from '@/shared/ui/publication-badge';
import { Skeleton } from '@/shared/ui/skeleton';
import { SolutionForm } from './solution-form';

interface SolutionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The solution being edited; null while creating. */
  solution: Solution | null;
  /** Room preselected for a new solution, for example the one chosen in the list filter. */
  presetRoomId?: string;
  /** Called after a save, so the page can keep the dialog open on a new solution and show its photo. */
  onSaved: (saved: SolutionDetail, wasCreated: boolean) => void;
  /** Photo block, rendered only for an existing solution. */
  gallery?: ReactNode;
}

export function SolutionFormDialog({
  open,
  onOpenChange,
  solution,
  presetRoomId,
  onSaved,
  gallery,
}: SolutionFormDialogProps) {
  const { t } = useTranslation();
  const [jump, setJump] = useState<{ id: string; key: number }>();
  const [isDirty, setIsDirty] = useState(false);
  const [isAskingDiscard, setIsAskingDiscard] = useState(false);
  const detail = useQuery({ ...solutionQueryOptions(solution?.id ?? ''), enabled: solution !== null });

  useEffect(() => {
    if (!open) {
      setJump(undefined);
      setIsDirty(false);
    }
  }, [open]);

  const requestClose = () => (isDirty ? setIsAskingDiscard(true) : onOpenChange(false));
  const isLoadingDetail = solution !== null && detail.data === undefined;

  return (
    <>
      <EditorDialog
        open={open}
        onOpenChange={(next) => !next && requestClose()}
        size="narrow"
        title={solution?.name ?? t('admin.solutions.createTitle')}
        subtitle={
          solution
            ? t('admin.solutions.editSubtitle', { room: solution.roomName, collection: solution.collectionName })
            : t('admin.solutions.formDescription')
        }
        badge={solution ? <PublicationBadge isPublished={solution.isPublished} /> : null}
      >
        {isLoadingDetail ? (
          <Skeleton className="m-6 h-64" />
        ) : (
          <SolutionForm
            key={solution?.id ?? 'new'}
            solution={detail.data ?? null}
            presetRoomId={presetRoomId}
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
        )}
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
