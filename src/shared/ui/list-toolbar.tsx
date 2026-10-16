import type { ReactNode } from 'react';

interface ListToolbarProps {
  /** Search and filters; they wrap among themselves on a narrow screen. */
  filters: ReactNode;
  /** Buttons that stay at the right end of the first row, for example "Create". */
  actions: ReactNode;
}

/** First row of an admin list screen: search and filters on the left, actions on the right. */
export function ListToolbar({ filters, actions }: ListToolbarProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">{filters}</div>
      <div className="flex shrink-0 items-center gap-2">{actions}</div>
    </div>
  );
}
