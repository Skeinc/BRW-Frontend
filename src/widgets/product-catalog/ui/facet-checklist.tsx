import { useId } from 'react';
import type { CatalogFacetValue } from '@/entities/product';
import { cn } from '@/shared/lib/utils';
import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';

interface FacetChecklistProps {
  title: string;
  /** Keeps the title for screen readers only, when a parent already shows it. */
  hideTitle?: boolean;
  values: readonly CatalogFacetValue[];
  selected: readonly string[];
  onToggle: (value: string) => void;
}

export function FacetChecklist({ title, hideTitle = false, values, selected, onToggle }: FacetChecklistProps) {
  const groupId = useId();
  return (
    <fieldset className="flex flex-col gap-1">
      <legend className={cn('mb-2 text-sm font-semibold', hideTitle && 'sr-only')}>{title}</legend>
      {values.map(({ value, count }) => {
        const id = `${groupId}-${value}`;
        return (
          <div key={value} className="flex min-h-9 items-center gap-2">
            <Checkbox
              className="border-foreground/40 bg-background"
              id={id}
              checked={selected.includes(value)}
              onCheckedChange={() => onToggle(value)}
            />
            <Label htmlFor={id} className="flex-1 cursor-pointer justify-between font-normal">
              <span>{value}</span>
              <span className="tabular-price text-xs text-muted-foreground">{count}</span>
            </Label>
          </div>
        );
      })}
    </fieldset>
  );
}
