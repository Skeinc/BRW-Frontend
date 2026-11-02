import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/ui/input';
import { Slider } from '@/shared/ui/slider';

/** Chosen ends of a range as strings; `undefined` means the end of the bounds. */
export interface RangeValue {
  from: string | undefined;
  to: string | undefined;
}

interface RangeFilterProps {
  label: string;
  /** Lowest and highest value of the current selection. */
  bounds: { min: number; max: number };
  value: RangeValue;
  onCommit: (range: RangeValue) => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Mount with a `key` of the URL range so the draft starts over when the URL changes. */
export function RangeFilter({ label, bounds, value, onCommit }: RangeFilterProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<[number, number]>([
    clamp(Number(value.from ?? bounds.min), bounds.min, bounds.max),
    clamp(Number(value.to ?? bounds.max), bounds.min, bounds.max),
  ]);

  const commit = ([low, high]: [number, number]): void => {
    const ordered: [number, number] = low <= high ? [low, high] : [high, low];
    setDraft(ordered);
    const next = {
      from: ordered[0] > bounds.min ? String(ordered[0]) : undefined,
      to: ordered[1] < bounds.max ? String(ordered[1]) : undefined,
    };
    if (next.from !== value.from || next.to !== value.to) {
      onCommit(next);
    }
  };

  const setEnd = (index: 0 | 1, raw: string): void => {
    const parsed = Number(raw);
    if (raw === '' || Number.isNaN(parsed)) {
      commit(index === 0 ? [bounds.min, draft[1]] : [draft[0], bounds.max]);
      return;
    }
    const value = clamp(Math.round(parsed), bounds.min, bounds.max);
    commit(index === 0 ? [value, draft[1]] : [draft[0], value]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <Input
          key={`min-${draft[0]}`}
          type="number"
          className="bg-background [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          inputMode="numeric"
          aria-label={t('catalog.filters.rangeFrom', { label })}
          placeholder={t('catalog.filters.from', { value: bounds.min })}
          defaultValue={draft[0] > bounds.min ? draft[0] : ''}
          onBlur={(event) => setEnd(0, event.target.value)}
        />
        <Input
          key={`max-${draft[1]}`}
          type="number"
          className="bg-background [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          inputMode="numeric"
          aria-label={t('catalog.filters.rangeTo', { label })}
          placeholder={t('catalog.filters.to', { value: bounds.max })}
          defaultValue={draft[1] < bounds.max ? draft[1] : ''}
          onBlur={(event) => setEnd(1, event.target.value)}
        />
      </div>
      <Slider
        min={bounds.min}
        max={bounds.max}
        step={1}
        value={draft}
        onValueChange={(next) => setDraft([next[0] ?? bounds.min, next[1] ?? bounds.max])}
        onValueCommit={(next) => commit([next[0] ?? bounds.min, next[1] ?? bounds.max])}
        aria-label={label}
        className="px-1"
      />
    </div>
  );
}
