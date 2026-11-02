import { useTranslation } from 'react-i18next';
import type { CatalogProductFacets, CatalogSearch } from '@/entities/product';
import { Button } from '@/shared/ui/button';
import { ProductFilters } from './product-filters';

interface FiltersPanelProps {
  facets: CatalogProductFacets | undefined;
  search: CatalogSearch;
  showCollections: boolean;
  activeCount: number;
  total: number | undefined;
  onChange: (patch: Partial<CatalogSearch>) => void;
  onReset: () => void;
  onShow: () => void;
}

/** Desktop filters: one wide panel above the products, as on brw-shop.by. */
export function FiltersPanel({
  facets,
  search,
  showCollections,
  activeCount,
  total,
  onChange,
  onReset,
  onShow,
}: FiltersPanelProps) {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="filters-panel-title" className="hidden rounded-xl bg-muted px-5 py-3 lg:block">
      <h2 id="filters-panel-title" className="mb-1 text-lg font-semibold">
        {t('catalog.filters.panelTitle')}
      </h2>
      <ProductFilters facets={facets} search={search} showCollections={showCollections} onChange={onChange} />
      <div className="mt-3 flex flex-col items-center gap-1">
        <Button className="h-11 w-full" onClick={onShow}>
          {t('catalog.filters.show', { count: total ?? 0 })}
        </Button>
        {activeCount > 0 && (
          <Button variant="link" onClick={onReset}>
            {t('catalog.filters.reset')}
          </Button>
        )}
      </div>
    </section>
  );
}
