import { useTranslation } from 'react-i18next';
import { Button } from './button';

interface EditorFooterProps {
  /** The form has unsaved changes. */
  isDirty: boolean;
  isPending: boolean;
  /** An error from the server that does not belong to a field. */
  error?: string | null;
  onCancel: () => void;
}

/** Bottom bar of an editor dialog: state of the form on the left, "Cancel" and "Save" on the right. */
export function EditorFooter({ isDirty, isPending, error, onCancel }: EditorFooterProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col-reverse items-stretch gap-3 border-t bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="min-h-5 text-sm" aria-live="polite">
        {error ? (
          <p role="alert" className="text-destructive">
            {error}
          </p>
        ) : isDirty ? (
          <p className="flex items-center gap-2 text-muted-foreground">
            <span className="size-2 rounded-full bg-amber-500" aria-hidden />
            {t('ui.editor.unsaved')}
          </p>
        ) : (
          <p className="text-muted-foreground max-sm:hidden">{t('ui.editor.shortcut')}</p>
        )}
      </div>
      <div className="flex gap-2 max-sm:[&>*]:flex-1">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('admin.common.cancel')}
        </Button>
        <Button type="submit" loading={isPending}>
          {t('admin.common.save')}
        </Button>
      </div>
    </div>
  );
}
