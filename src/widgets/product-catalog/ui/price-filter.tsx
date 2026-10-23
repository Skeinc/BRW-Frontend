import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/ui/input';
import { Slider } from '@/shared/ui/slider';

interface PriceFilterProps {
  /** Lowest and highest price of the current selection. */
  bounds: { min: number; max: number };
  priceMin: string | undefined;
  priceMax: string | undefined;
  onCommit: (range: { priceMin: string | undefined; priceMax: string | undefined }) => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Mount with a `key` of the URL range so the draft starts over when the URL changes. */
export function PriceFilter({ bounds, priceMin, priceMax, onCommit }: PriceFilterProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<[number, number]>([
    clamp(Number(priceMin ?? bounds.min), bounds.min, bounds.max),
    clamp(Number(priceMax ?? bounds.max), bounds.min, bounds.max),
  ]);

  const commit = ([low, high]: [number, number]): void => {
    const ordered: [number, number] = low <= high ? [low, high] : [high, low];
    setDraft(ordered);
    const next = {
      priceMin: ordered[0] > bounds.min ? String(ordered[0]) : undefined,
      priceMax: ordered[1] < bounds.max ? String(ordered[1]) : undefined,
    };
    if (next.priceMin !== priceMin || next.priceMax !== priceMax) {
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
          className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          inputMode="numeric"
          aria-label={t('catalog.filters.priceFrom')}
          placeholder={t('catalog.filters.from', { value: bounds.min })}
          defaultValue={draft[0] > bounds.min ? draft[0] : ''}
          onBlur={(event) => setEnd(0, event.target.value)}
        />
        <Input
          key={`max-${draft[1]}`}
          type="number"
          className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          inputMode="numeric"
          aria-label={t('catalog.filters.priceTo')}
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
        aria-label={t('catalog.filters.price')}
        className="px-1"
      />
    </div>
  );
}
