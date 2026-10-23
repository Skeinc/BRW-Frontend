import type { CatalogFacetValue } from '@/entities/product';
import { getColorSwatch } from '@/shared/lib/color-swatches';
import { cn } from '@/shared/lib/utils';

interface ColorSwatchesProps {
  title: string;
  values: readonly CatalogFacetValue[];
  selected: readonly string[];
  onToggle: (value: string) => void;
}

export function ColorSwatches({ title, values, selected, onToggle }: ColorSwatchesProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-sm font-semibold">{title}</legend>
      <div className="flex flex-wrap gap-2">
        {values.map(({ value, count }) => {
          const color = getColorSwatch(value);
          const isSelected = selected.includes(value);
          return (
            <button
              key={value}
              type="button"
              aria-pressed={isSelected}
              aria-label={`${value} (${count})`}
              title={`${value} · ${count}`}
              onClick={() => onToggle(value)}
              className={cn(
                'inline-flex items-center justify-center rounded-full border transition-colors',
                color ? 'size-9 p-1' : 'min-h-9 px-3 text-xs',
                isSelected ? 'border-foreground' : 'border-border hover:border-foreground/40',
                !color && isSelected && 'bg-foreground text-background',
              )}
            >
              {color ? (
                <span
                  aria-hidden
                  className="size-full rounded-full border border-black/10"
                  style={{ backgroundColor: color }}
                />
              ) : (
                value
              )}
            </button>
          );
        })}
      </div>
      {selected.length === 1 && <p className="text-xs text-muted-foreground">{selected[0]}</p>}
    </fieldset>
  );
}
