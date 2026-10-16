import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from './confirm-dialog';

interface DiscardChangesDialogProps {
  open: boolean;
  onKeepEditing: () => void;
  onDiscard: () => void;
}

/** Asks before an editor dialog is closed with unsaved changes. */
export function DiscardChangesDialog({ open, onKeepEditing, onDiscard }: DiscardChangesDialogProps) {
  const { t } = useTranslation();
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          onKeepEditing();
        }
      }}
      title={t('ui.editor.discardTitle')}
      description={t('ui.editor.discardDescription')}
      confirmLabel={t('ui.editor.discard')}
      cancelLabel={t('ui.editor.keepEditing')}
      onConfirm={onDiscard}
    />
  );
}
