import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './empty';

interface DataTableEmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  /** What to do next, for example a create or reset button. */
  action?: ReactNode;
}

export function DataTableEmptyState({ title, description, icon: Icon, action }: DataTableEmptyStateProps) {
  return (
    <Empty className="p-6 md:p-6">
      <EmptyHeader className="gap-1">
        {Icon ? (
          <EmptyMedia
            variant="icon"
            className="mb-3 size-16 rounded-full bg-accent text-accent-foreground [&_svg:not([class*='size-'])]:size-7"
          >
            <Icon aria-hidden />
          </EmptyMedia>
        ) : null}
        <EmptyTitle className="text-lg font-semibold">{title}</EmptyTitle>
        {description ? <EmptyDescription className="max-w-sm">{description}</EmptyDescription> : null}
      </EmptyHeader>
      {action ? <EmptyContent>{action}</EmptyContent> : null}
    </Empty>
  );
}
