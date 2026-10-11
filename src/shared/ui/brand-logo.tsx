import { cn } from '@/shared/lib/utils';

interface BrandLogoProps {
  /** `onDark` for the footer, `onLight` for the header. */
  tone?: 'onDark' | 'onLight';
  className?: string;
}

const BAR_CLASSES = {
  onDark: ['bg-background/30', 'bg-primary', 'bg-background'],
  onLight: ['bg-foreground', 'bg-primary', 'bg-border'],
} as const;

const CAPTION_CLASSES = {
  onDark: 'text-background/60',
  onLight: 'hidden text-muted-foreground sm:block',
} as const;

/** Text logo with the three brand bars. */
export function BrandLogo({ tone = 'onDark', className }: BrandLogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="flex h-8 items-stretch gap-1" aria-hidden>
        {BAR_CLASSES[tone].map((barClass) => (
          <span key={barClass} className={cn('w-1.5 rounded-sm', barClass)} />
        ))}
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-2xl font-extrabold tracking-tight">BRW</span>
        <span className={cn('mt-1 text-[0.625rem] font-medium tracking-[0.2em]', CAPTION_CLASSES[tone])}>
          BLACK RED WHITE
        </span>
      </span>
    </div>
  );
}
