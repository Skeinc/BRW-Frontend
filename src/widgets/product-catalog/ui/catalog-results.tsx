import { useTranslation } from 'react-i18next';
import { CATALOG_PAGE_SIZE, type CatalogProductCard } from '@/entities/product';
import type { Paginated } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Spinner } from '@/shared/ui/spinner';
import { useLoadMore } from '../model/use-load-more';
import { CatalogPagination } from './catalog-pagination';
import { ProductGrid } from './product-grid';
import type { CatalogProductsParams } from '@/entities/product';

interface CatalogResultsProps {
  params: CatalogProductsParams;
  firstPage: Paginated<CatalogProductCard>;
  isRefreshing: boolean;
}

/** Mount with a `key` of the params so the appended pages are dropped when the list changes. */
export function CatalogResults({ params, firstPage, isRefreshing }: CatalogResultsProps) {
  const { t } = useTranslation();
  const more = useLoadMore(params);
  const page = params.page ?? 1;
  const remaining = Math.max(0, firstPage.total - more.lastPage * CATALOG_PAGE_SIZE);
  const totalPages = Math.ceil(firstPage.total / CATALOG_PAGE_SIZE);
  const shownIds = new Set(firstPage.items.map((item) => item.id));
  const appended = more.items.filter((item) => !shownIds.has(item.id));
  return (
    <div className="flex flex-col gap-8">
      <ProductGrid
        products={[...firstPage.items, ...appended]}
        className={isRefreshing ? 'opacity-60 transition-opacity' : 'transition-opacity'}
      />
      <div className="flex flex-col items-center gap-4">
        {remaining > 0 && (
          <Button
            variant="outline"
            className="h-11 bg-card px-6"
            disabled={more.isLoading}
            onClick={() => void more.loadMore()}
          >
            {more.isLoading && <Spinner aria-hidden />}
            {t('catalog.loadMore', { count: Math.min(CATALOG_PAGE_SIZE, remaining) })}
          </Button>
        )}
        {more.isError && (
          <p role="alert" className="text-sm text-destructive">
            {t('catalog.loadMoreError')}
          </p>
        )}
        <CatalogPagination page={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
