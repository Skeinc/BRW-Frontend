import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/utils';
import { Input } from './input';

interface AdornedInputProps extends ComponentProps<typeof Input> {
  /** Unit or currency shown inside the field at the right, for example `BYN` or `mm`. */
  suffix: string;
}

export function AdornedInput({ suffix, className, ...props }: AdornedInputProps) {
  return (
    <div className="relative">
      <Input className={cn('pr-14', className)} {...props} />
      <span
        className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground"
        aria-hidden
      >
        {suffix}
      </span>
    </div>
  );
}
