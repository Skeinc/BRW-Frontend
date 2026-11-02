import { useRef, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  catalogProductFacetsQueryOptions,
  catalogProductsQueryOptions,
  clearCatalogFilters,
  countActiveFilters,
  toCatalogFilters,
  toCatalogParams,
  type CatalogProductFilters,
  type CatalogSearch,
} from '@/entities/product';
import { ErrorState } from '@/shared/ui/error-state';
import { ActiveFilterChips } from './active-filter-chips';
import { CatalogEmpty } from './catalog-empty';
import { CatalogResults } from './catalog-results';
import { FiltersPanel } from './filters-panel';
import { FiltersSheet } from './filters-sheet';
import { ProductGrid } from './product-grid';
import { SortSelect } from './sort-select';

interface ProductCatalogProps {
  search: CatalogSearch;
  /** Filters fixed by the page itself: the slug of its category or collection. */
  pinned?: CatalogProductFilters;
  showCollections?: boolean;
  /** Set to false to hide the filter sidebar and sheet and keep only sorting. */
  withFilters?: boolean;
  /** Shown instead of the empty-filters state when the page has no products at all. */
  emptyState?: ReactNode;
  onSearchChange: (next: CatalogSearch) => void;
}

export function ProductCatalog({
  search,
  pinned = {},
  showCollections = false,
  withFilters = true,
  emptyState,
  onSearchChange,
}: ProductCatalogProps) {
  const { t } = useTranslation();
  const params = toCatalogParams(search, pinned);
  const products = useQuery(catalogProductsQueryOptions(params));
  const facets = useQuery(catalogProductFacetsQueryOptions(toCatalogFilters(search, pinned)));
  const activeCount = countActiveFilters(search);
  const total = products.data?.total;
  const resultsRef = useRef<HTMLDivElement>(null);

  const change = (patch: Partial<CatalogSearch>): void => onSearchChange({ ...search, ...patch, page: undefined });
  const reset = (): void => onSearchChange(clearCatalogFilters(search));

  let results: ReactNode;
  if (products.isError && !products.data) {
    results = (
      <ErrorState error={products.error} onRetry={() => void products.refetch()} isRetrying={products.isFetching} />
    );
  } else if (!products.data) {
    results = <ProductGrid products={undefined} />;
  } else if (products.data.total === 0) {
    results = activeCount === 0 && emptyState ? emptyState : <CatalogEmpty onReset={reset} />;
  } else {
    results = (
      <CatalogResults
        key={JSON.stringify(params)}
        params={params}
        firstPage={products.data}
        isRefreshing={products.isPlaceholderData}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {withFilters && (
        <FiltersPanel
          facets={facets.data}
          search={search}
          showCollections={showCollections}
          activeCount={activeCount}
          total={total}
          onChange={change}
          onReset={reset}
          onShow={() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        />
      )}
      <div ref={resultsRef} className="flex min-w-0 scroll-mt-40 flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {withFilters && (
            <FiltersSheet
              facets={facets.data}
              search={search}
              showCollections={showCollections}
              activeCount={activeCount}
              total={total}
              onChange={change}
              onReset={reset}
            />
          )}
          <p aria-live="polite" className="tabular-price hidden text-sm text-muted-foreground sm:block">
            {total !== undefined && t('catalog.foundCount', { count: total })}
          </p>
          <SortSelect value={search.sort} onChange={(sort) => onSearchChange({ ...search, sort, page: undefined })} />
        </div>
        {withFilters && <ActiveFilterChips search={search} facets={facets.data} onChange={change} />}
        {results}
      </div>
    </div>
  );
}
