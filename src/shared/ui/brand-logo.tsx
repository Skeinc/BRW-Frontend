import { cn } from '@/shared/lib/utils';

interface BrandLogoProps {
  className?: string;
}

/** Text logo with the three brand bars, for dark surfaces. */
export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="flex h-8 items-stretch gap-1" aria-hidden>
        <span className="w-1.5 rounded-sm bg-background/30" />
        <span className="w-1.5 rounded-sm bg-primary" />
        <span className="w-1.5 rounded-sm bg-background" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-2xl font-extrabold tracking-tight">BRW</span>
        <span className="mt-1 text-[0.625rem] font-medium tracking-[0.2em] text-background/60">BLACK RED WHITE</span>
      </span>
    </div>
  );
}
