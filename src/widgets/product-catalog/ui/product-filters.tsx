import { useTranslation } from 'react-i18next';
import type { CatalogFacetValue, CatalogProductFacets, CatalogSearch } from '@/entities/product';
import { Label } from '@/shared/ui/label';
import { Switch } from '@/shared/ui/switch';
import { ColorSwatches } from './color-swatches';
import { FacetChecklist } from './facet-checklist';
import { PriceFilter } from './price-filter';

interface ProductFiltersProps {
  facets: CatalogProductFacets | undefined;
  search: CatalogSearch;
  /** Collections are offered only where the list is not pinned to one. */
  showCollections: boolean;
  onChange: (patch: Partial<CatalogSearch>) => void;
}

/** Facet values plus the selected ones that the current selection no longer offers. */
function withSelected(values: readonly CatalogFacetValue[], selected: readonly string[]): CatalogFacetValue[] {
  const missing = selected.filter((value) => !values.some((item) => item.value === value));
  return [...values, ...missing.map((value) => ({ value, count: 0 }))];
}

function toggle(list: readonly string[] | undefined, value: string): string[] | undefined {
  const current = list ?? [];
  const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
  return next.length > 0 ? next : undefined;
}

export function ProductFilters({ facets, search, showCollections, onChange }: ProductFiltersProps) {
  const { t } = useTranslation();
  const min = Math.floor(Number(facets?.price.min));
  const max = Math.ceil(Number(facets?.price.max));
  const hasPrice = facets !== undefined && Number.isFinite(min) && Number.isFinite(max) && min < max;
  const material = search.material ?? [];
  const colorBody = search.colorBody ?? [];
  const colorFacade = search.colorFacade ?? [];
  return (
    <div className="flex flex-col gap-6">
      {hasPrice && (
        <section aria-labelledby="filter-price" className="flex flex-col gap-3">
          <h2 id="filter-price" className="text-sm font-semibold">
            {t('catalog.filters.price')}
          </h2>
          <PriceFilter
            key={`${search.priceMin ?? ''}-${search.priceMax ?? ''}-${min}-${max}`}
            bounds={{ min, max }}
            priceMin={search.priceMin}
            priceMax={search.priceMax}
            onCommit={onChange}
          />
        </section>
      )}
      {showCollections && facets && facets.collections.length > 0 && (
        <FacetChecklist
          title={t('catalog.filters.collection')}
          values={facets.collections.map((item) => ({ value: item.name, count: item.count }))}
          selected={facets.collections.filter((item) => item.slug === search.collection).map((item) => item.name)}
          onToggle={(name) => {
            const slug = facets.collections.find((item) => item.name === name)?.slug;
            onChange({ collection: slug === search.collection ? undefined : slug });
          }}
        />
      )}
      {facets && (facets.materials.length > 0 || material.length > 0) && (
        <FacetChecklist
          title={t('catalog.filters.material')}
          values={withSelected(facets.materials, material)}
          selected={material}
          onToggle={(value) => onChange({ material: toggle(search.material, value) })}
        />
      )}
      {facets && (facets.colorsBody.length > 0 || colorBody.length > 0) && (
        <ColorSwatches
          title={t('catalog.filters.colorBody')}
          values={withSelected(facets.colorsBody, colorBody)}
          selected={colorBody}
          onToggle={(value) => onChange({ colorBody: toggle(search.colorBody, value) })}
        />
      )}
      {facets && (facets.colorsFacade.length > 0 || colorFacade.length > 0) && (
        <ColorSwatches
          title={t('catalog.filters.colorFacade')}
          values={withSelected(facets.colorsFacade, colorFacade)}
          selected={colorFacade}
          onToggle={(value) => onChange({ colorFacade: toggle(search.colorFacade, value) })}
        />
      )}
      <div className="flex min-h-11 items-center justify-between gap-3">
        <Label htmlFor="filter-in-stock" className="font-normal">
          {t('catalog.filters.inStock')}
        </Label>
        <Switch
          id="filter-in-stock"
          checked={search.inStock === true}
          onCheckedChange={(checked) => onChange({ inStock: checked ? true : undefined })}
        />
      </div>
    </div>
  );
}
