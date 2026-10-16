import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';

interface EditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** A line under the title: what the form is for, or details of the record. */
  subtitle?: string;
  /** Shown next to the title, for example a "Published" badge. */
  badge?: ReactNode;
  /** `wide` for long forms with a section menu, `narrow` for short ones. */
  size?: 'wide' | 'narrow';
  children: ReactNode;
}

/** Dialog for creating or editing a record: full screen on a phone, a large window on a wide screen. */
export function EditorDialog({
  open,
  onOpenChange,
  title,
  subtitle,
  badge,
  size = 'wide',
  children,
}: EditorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(event) => event.preventDefault()}
        className={cn(
          'flex flex-col gap-0 overflow-hidden p-0',
          'max-sm:top-0 max-sm:left-0 max-sm:h-svh max-sm:max-h-svh max-sm:max-w-full max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none max-sm:border-0',
          size === 'wide' ? 'sm:h-[88svh] sm:max-w-5xl' : 'sm:max-h-[88svh] sm:max-w-2xl',
        )}
      >
        <DialogHeader className="gap-1 border-b px-4 py-4 pr-16 text-left sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <DialogTitle className="truncate text-lg">{title}</DialogTitle>
            {badge}
          </div>
          <DialogDescription className={cn('truncate text-sm', !subtitle && 'sr-only')}>
            {subtitle ?? title}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
