import { useQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';
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
import { getApiErrorMessage } from '@/shared/api';
import { ActiveFilterChips } from './active-filter-chips';
import { CatalogEmpty } from './catalog-empty';
import { CatalogResults } from './catalog-results';
import { FiltersSheet } from './filters-sheet';
import { ProductFilters } from './product-filters';
import { ProductGrid } from './product-grid';
import { SortSelect } from './sort-select';

interface ProductCatalogProps {
  search: CatalogSearch;
  /** Filters fixed by the page itself: the slug of its category or collection. */
  pinned?: CatalogProductFilters;
  showCollections?: boolean;
  /** Shown instead of the empty-filters state when the page has no products at all. */
  emptyState?: ReactNode;
  onSearchChange: (next: CatalogSearch) => void;
}

export function ProductCatalog({
  search,
  pinned = {},
  showCollections = false,
  emptyState,
  onSearchChange,
}: ProductCatalogProps) {
  const { t } = useTranslation();
  const params = toCatalogParams(search, pinned);
  const products = useQuery(catalogProductsQueryOptions(params));
  const facets = useQuery(catalogProductFacetsQueryOptions(toCatalogFilters(search, pinned)));
  const activeCount = countActiveFilters(search);
  const total = products.data?.total;

  const change = (patch: Partial<CatalogSearch>): void => onSearchChange({ ...search, ...patch, page: undefined });
  const reset = (): void => onSearchChange(clearCatalogFilters(search));

  let results: ReactNode;
  if (products.isError && !products.data) {
    results = (
      <p role="alert" className="rounded-xl border bg-card p-6 text-center text-muted-foreground">
        {getApiErrorMessage(products.error, t)}
      </p>
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
    <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside aria-label={t('catalog.filters.title')} className="hidden lg:block">
        <ProductFilters facets={facets.data} search={search} showCollections={showCollections} onChange={change} />
      </aside>
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FiltersSheet
            facets={facets.data}
            search={search}
            showCollections={showCollections}
            activeCount={activeCount}
            total={total}
            onChange={change}
            onReset={reset}
          />
          <p aria-live="polite" className="tabular-price hidden text-sm text-muted-foreground sm:block">
            {total !== undefined && t('catalog.foundCount', { count: total })}
          </p>
          <SortSelect value={search.sort} onChange={(sort) => onSearchChange({ ...search, sort, page: undefined })} />
        </div>
        <ActiveFilterChips search={search} facets={facets.data} onChange={change} />
        {results}
      </div>
    </div>
  );
}
