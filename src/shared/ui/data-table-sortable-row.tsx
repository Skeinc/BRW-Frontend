import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { Button } from './button';
import { DisabledWithTooltip } from './disabled-with-tooltip';
import { TableCell, TableRow } from './table';

interface DataTableSortableRowProps {
  id: string;
  /** False while sorting is unavailable, for example under a search or filter. */
  enabled: boolean;
  handleLabel: string;
  disabledReason?: ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
  children: ReactNode;
}

export function DataTableSortableRow({
  id,
  enabled,
  handleLabel,
  disabledReason,
  className,
  onClick,
  children,
}: DataTableSortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: !enabled,
  });

  return (
    <TableRow
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(className, isDragging && 'relative z-20 bg-muted shadow-md')}
      onClick={onClick}
    >
      <TableCell className="w-10 py-0 pr-0">
        {enabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
            aria-label={handleLabel}
            {...attributes}
            {...listeners}
          >
            <GripVertical aria-hidden />
          </Button>
        ) : (
          <DisabledWithTooltip reason={disabledReason} side="right">
            <span className="flex size-8 items-center justify-center text-muted-foreground/40">
              <GripVertical className="size-4" aria-hidden />
            </span>
          </DisabledWithTooltip>
        )}
      </TableCell>
      {children}
    </TableRow>
  );
}
