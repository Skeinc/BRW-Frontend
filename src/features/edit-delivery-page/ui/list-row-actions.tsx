import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/button';

interface ListRowActionsProps {
  index: number;
  count: number;
  /** Removing is blocked for the last remaining row. */
  canRemove: boolean;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
}

/** Move up, move down and remove buttons of one editable list row. */
export function ListRowActions({ index, count, canRemove, onMove, onRemove }: ListRowActionsProps) {
  const { t } = useTranslation();
  return (
    <div className="flex shrink-0 items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-10 text-muted-foreground"
        aria-label={t('admin.deliveryPage.moveUp')}
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
      >
        <ArrowUp aria-hidden />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-10 text-muted-foreground"
        aria-label={t('admin.deliveryPage.moveDown')}
        disabled={index === count - 1}
        onClick={() => onMove(index, index + 1)}
      >
        <ArrowDown aria-hidden />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-10 text-muted-foreground hover:text-destructive"
        aria-label={t('admin.deliveryPage.remove')}
        disabled={!canRemove}
        onClick={() => onRemove(index)}
      >
        <Trash2 aria-hidden />
      </Button>
    </div>
  );
}
