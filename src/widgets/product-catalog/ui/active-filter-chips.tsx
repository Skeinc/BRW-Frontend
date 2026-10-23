import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CatalogProductFacets, CatalogSearch } from '@/entities/product';
import { Button } from '@/shared/ui/button';

interface FilterChip {
  key: string;
  label: string;
  patch: Partial<CatalogSearch>;
}

interface ActiveFilterChipsProps {
  search: CatalogSearch;
  facets: CatalogProductFacets | undefined;
  onChange: (patch: Partial<CatalogSearch>) => void;
}

function without(list: readonly string[] | undefined, value: string): string[] | undefined {
  const next = (list ?? []).filter((item) => item !== value);
  return next.length > 0 ? next : undefined;
}

export function ActiveFilterChips({ search, facets, onChange }: ActiveFilterChipsProps) {
  const { t } = useTranslation();
  const chips: FilterChip[] = [];
  const collection = facets?.collections.find((item) => item.slug === search.collection);
  if (search.collection) {
    chips.push({ key: 'collection', label: collection?.name ?? search.collection, patch: { collection: undefined } });
  }
  if (search.priceMin || search.priceMax) {
    chips.push({
      key: 'price',
      label: t('catalog.filters.priceRange', { from: search.priceMin ?? '…', to: search.priceMax ?? '…' }),
      patch: { priceMin: undefined, priceMax: undefined },
    });
  }
  for (const value of search.material ?? []) {
    chips.push({ key: `material-${value}`, label: value, patch: { material: without(search.material, value) } });
  }
  for (const value of search.colorBody ?? []) {
    chips.push({ key: `body-${value}`, label: value, patch: { colorBody: without(search.colorBody, value) } });
  }
  for (const value of search.colorFacade ?? []) {
    chips.push({ key: `facade-${value}`, label: value, patch: { colorFacade: without(search.colorFacade, value) } });
  }
  if (search.inStock) {
    chips.push({ key: 'in-stock', label: t('catalog.filters.inStock'), patch: { inStock: undefined } });
  }
  if (chips.length === 0) {
    return null;
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <li key={chip.key}>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-card"
            aria-label={t('catalog.filters.remove', { name: chip.label })}
            onClick={() => onChange(chip.patch)}
          >
            {chip.label}
            <X aria-hidden />
          </Button>
        </li>
      ))}
    </ul>
  );
}
