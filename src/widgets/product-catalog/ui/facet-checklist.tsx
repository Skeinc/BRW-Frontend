import { useId } from 'react';
import type { CatalogFacetValue } from '@/entities/product';
import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';

interface FacetChecklistProps {
  title: string;
  values: readonly CatalogFacetValue[];
  selected: readonly string[];
  onToggle: (value: string) => void;
}

export function FacetChecklist({ title, values, selected, onToggle }: FacetChecklistProps) {
  const groupId = useId();
  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="mb-2 text-sm font-semibold">{title}</legend>
      {values.map(({ value, count }) => {
        const id = `${groupId}-${value}`;
        return (
          <div key={value} className="flex min-h-9 items-center gap-2">
            <Checkbox id={id} checked={selected.includes(value)} onCheckedChange={() => onToggle(value)} />
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
