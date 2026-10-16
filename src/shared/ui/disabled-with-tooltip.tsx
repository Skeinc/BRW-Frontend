import { cn } from '@/shared/lib/utils';
import type { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

interface DisabledWithTooltipProps {
  /** Why the control is unavailable; without it the wrapper is inert and the tooltip never opens. */
  reason?: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Layout of the wrapper, e.g. `flex w-full` around a menu item or flex-item classes of the wrapped button. */
  className?: string;
  /** Keyboard users reach the tooltip through the wrapper; off inside menus that manage focus themselves. */
  isFocusable?: boolean;
  children: ReactNode;
}

/**
 * Explains a disabled control. A disabled control gets no pointer events, so the tooltip hangs on a wrapper element.
 * The wrapper is always rendered, so the control keeps its identity (focus, pending state) when `reason` appears or goes.
 */
export function DisabledWithTooltip({
  reason,
  side = 'top',
  className,
  isFocusable = true,
  children,
}: DisabledWithTooltipProps) {
  const hasReason = Boolean(reason);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          tabIndex={hasReason && isFocusable ? 0 : undefined}
          className={cn(
            'inline-flex rounded-md',
            hasReason && 'cursor-not-allowed focus-visible:ring-2 focus-visible:ring-ring',
            className,
          )}
        >
          {children}
        </span>
      </TooltipTrigger>
      {hasReason ? <TooltipContent side={side}>{reason}</TooltipContent> : null}
    </Tooltip>
  );
}
