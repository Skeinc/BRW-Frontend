import { useTranslation } from 'react-i18next';
import type { CatalogDimension, CatalogFacetValue, CatalogProductFacets, CatalogSearch } from '@/entities/product';
import { FacetChecklist } from './facet-checklist';
import { FilterGroup } from './filter-group';
import { RangeSection } from './range-section';

interface ProductFiltersProps {
  facets: CatalogProductFacets | undefined;
  search: CatalogSearch;
  /** Collections are offered only where the list is not pinned to one. */
  showCollections: boolean;
  onChange: (patch: Partial<CatalogSearch>) => void;
  /** `panel` shows the groups as select-like fields in the wide panel above the products. */
  layout?: 'column' | 'panel';
}

const DIMENSIONS: readonly CatalogDimension[] = ['width', 'height', 'depth', 'length'];

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

export function ProductFilters({ facets, search, showCollections, onChange, layout = 'column' }: ProductFiltersProps) {
  const { t } = useTranslation();
  const min = Math.floor(Number(facets?.price.min));
  const max = Math.ceil(Number(facets?.price.max));
  const hasPrice = facets !== undefined && Number.isFinite(min) && Number.isFinite(max) && min < max;
  const material = search.material ?? [];
  const colorBody = search.colorBody ?? [];
  const colorFacade = search.colorFacade ?? [];
  const isPanel = layout === 'panel';
  const priceSection = hasPrice && (
    <RangeSection
      label={t('catalog.filters.price')}
      defaultOpen
      bounds={{ min, max }}
      value={{ from: search.priceMin, to: search.priceMax }}
      onCommit={({ from, to }) => onChange({ priceMin: from, priceMax: to })}
    />
  );
  const sizeSections = DIMENSIONS.map((name) => {
    const range = facets?.dimensions[name];
    if (range?.min == null || range.max == null || range.min >= range.max) {
      return null;
    }
    const from = search[`${name}Min`];
    const to = search[`${name}Max`];
    return (
      <RangeSection
        key={name}
        label={t(`catalog.filters.${name}`)}
        bounds={{ min: range.min, max: range.max }}
        value={{ from: from?.toString(), to: to?.toString() }}
        onCommit={(next) =>
          onChange({
            [`${name}Min`]: next.from === undefined ? undefined : Number(next.from),
            [`${name}Max`]: next.to === undefined ? undefined : Number(next.to),
          })
        }
      />
    );
  });
  const collections = showCollections && facets && facets.collections.length > 0 ? facets.collections : [];
  const groups = [
    collections.length > 0 && {
      id: 'collection',
      selected: collections.filter((item) => item.slug === search.collection).map((item) => item.name),
      title: t('catalog.filters.collection'),
      node: (
        <FacetChecklist
          title={t('catalog.filters.collection')}
          hideTitle={isPanel}
          values={collections.map((item) => ({ value: item.name, count: item.count }))}
          selected={collections.filter((item) => item.slug === search.collection).map((item) => item.name)}
          onToggle={(name) => {
            const slug = collections.find((item) => item.name === name)?.slug;
            onChange({ collection: slug === search.collection ? undefined : slug });
          }}
        />
      ),
    },
    facets &&
      (facets.materials.length > 0 || material.length > 0) && {
        id: 'material',
        selected: material,
        title: t('catalog.filters.material'),
        node: (
          <FacetChecklist
            title={t('catalog.filters.material')}
            hideTitle={isPanel}
            values={withSelected(facets.materials, material)}
            selected={material}
            onToggle={(value) => onChange({ material: toggle(search.material, value) })}
          />
        ),
      },
    facets &&
      (facets.colorsBody.length > 0 || colorBody.length > 0) && {
        id: 'colorBody',
        selected: colorBody,
        title: t('catalog.filters.colorBody'),
        node: (
          <FacetChecklist
            title={t('catalog.filters.colorBody')}
            hideTitle={isPanel}
            values={withSelected(facets.colorsBody, colorBody)}
            selected={colorBody}
            onToggle={(value) => onChange({ colorBody: toggle(search.colorBody, value) })}
          />
        ),
      },
    facets &&
      (facets.colorsFacade.length > 0 || colorFacade.length > 0) && {
        id: 'colorFacade',
        selected: colorFacade,
        title: t('catalog.filters.colorFacade'),
        node: (
          <FacetChecklist
            title={t('catalog.filters.colorFacade')}
            hideTitle={isPanel}
            values={withSelected(facets.colorsFacade, colorFacade)}
            selected={colorFacade}
            onToggle={(value) => onChange({ colorFacade: toggle(search.colorFacade, value) })}
          />
        ),
      },
  ].filter((group) => group !== false && group !== undefined);
  const dropdowns = groups.filter(({ id }) => id !== 'colorFacade');
  const facadeGroup = groups.find(({ id }) => id === 'colorFacade');
  if (isPanel) {
    return (
      <div className="flex flex-col gap-1">
        {priceSection}
        {dropdowns.map(({ id, title, selected, node }) => (
          <FilterGroup key={id} label={title} selected={selected}>
            {node}
          </FilterGroup>
        ))}
        {sizeSections}
        {facadeGroup && (
          <FilterGroup label={facadeGroup.title} selected={facadeGroup.selected}>
            {facadeGroup.node}
          </FilterGroup>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6">
      {priceSection}
      {groups.map(({ id, node }) => (
        <div key={id}>{node}</div>
      ))}
      {sizeSections}
    </div>
  );
}
