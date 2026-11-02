import { ChevronDownIcon } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/ui/collapsible';
import { RangeFilter, type RangeValue } from './range-filter';

interface RangeSectionProps {
  label: string;
  bounds: { min: number; max: number };
  value: RangeValue;
  onCommit: (range: RangeValue) => void;
  /** Only the price starts open; a size opens on click, or when it already has a range. */
  defaultOpen?: boolean;
}

/** A collapsible range filter: price or one of the sizes. */
export function RangeSection({ label, bounds, value, onCommit, defaultOpen = false }: RangeSectionProps) {
  const hasValue = value.from !== undefined || value.to !== undefined;
  return (
    <Collapsible defaultOpen={defaultOpen || hasValue} className="flex flex-col gap-2">
      <CollapsibleTrigger className="group flex min-h-11 w-full lg:min-h-7 items-center justify-between gap-3 text-left text-sm font-semibold">
        {label}
        <ChevronDownIcon
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <RangeFilter
          key={`${value.from ?? ''}-${value.to ?? ''}-${bounds.min}-${bounds.max}`}
          label={label}
          bounds={bounds}
          value={value}
          onCommit={onCommit}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
