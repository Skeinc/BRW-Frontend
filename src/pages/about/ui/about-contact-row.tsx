import type { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface AboutContactRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  isExternal?: boolean;
}

export function AboutContactRow({ icon: Icon, label, value, href, isExternal = false }: AboutContactRowProps) {
  const content = (
    <>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon aria-hidden className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
        <span className="tabular-price mt-1 block break-words text-base font-semibold sm:text-lg">{value}</span>
      </span>
    </>
  );
  const className = 'flex min-h-20 flex-1 items-center gap-4 p-5 sm:p-6';
  if (!href) {
    return <div className={className}>{content}</div>;
  }
  return (
    <a
      href={href}
      className={cn(className, 'transition-colors hover:bg-accent')}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {content}
    </a>
  );
}
