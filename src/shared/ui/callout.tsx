import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface CalloutProps {
  icon: LucideIcon;
  title: string;
  tone?: 'warning' | 'neutral';
  children: ReactNode;
}

export function Callout({ icon: Icon, title, tone = 'neutral', children }: CalloutProps) {
  return (
    <div
      role="note"
      className={cn(
        'flex gap-4 rounded-xl border p-5 sm:p-6',
        tone === 'warning' ? 'border-primary/30 bg-accent' : 'bg-card',
      )}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon aria-hidden className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-lg font-semibold">{title}</p>
        <div className="mt-2 space-y-2 text-sm text-muted-foreground sm:text-base">{children}</div>
      </div>
    </div>
  );
}
