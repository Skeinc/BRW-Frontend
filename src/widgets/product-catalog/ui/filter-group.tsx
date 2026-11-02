import type { ReactNode } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/ui/collapsible';

interface FilterGroupProps {
  label: string;
  /** Names of the chosen values; shown next to the label while the group is closed. */
  selected: readonly string[];
  children: ReactNode;
}

/** A closed row with the group title; the options open below it on click, or at once when something is chosen. */
export function FilterGroup({ label, selected, children }: FilterGroupProps) {
  return (
    <Collapsible defaultOpen={selected.length > 0} className="flex flex-col gap-2">
      <CollapsibleTrigger className="group -mx-2 flex min-h-11 w-[calc(100%+1rem)] cursor-pointer items-center justify-between gap-3 rounded-md px-2 text-left text-sm font-semibold transition-colors hover:bg-foreground/5 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none lg:min-h-7">
        {label}
        <ChevronDownIcon
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="max-h-72 overflow-y-auto">{children}</CollapsibleContent>
    </Collapsible>
  );
}
