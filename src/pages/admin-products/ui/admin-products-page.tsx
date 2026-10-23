import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { productsPageQueryOptions, type ProductListItem } from '@/entities/product';
import { EntityGallery } from '@/features/entity-gallery';
import { ProductFormDialog } from '@/features/upsert-product';
import { hasProductFilters, toProductListParams, type ProductsSearch } from '../model/products-search';
import { DeleteProductDialog } from './delete-product-dialog';
import { ProductsTable } from './products-table';
import { ProductsToolbar } from './products-toolbar';

interface AdminProductsPageProps {
  search: ProductsSearch;
  onSearchChange: (patch: Partial<ProductsSearch>) => void;
}

export function AdminProductsPage({ search, onSearchChange }: AdminProductsPageProps) {
  const params = toProductListParams(search);
  const productsQuery = useQuery({ ...productsPageQueryOptions(params), placeholderData: keepPreviousData });
  const [productToDelete, setProductToDelete] = useState<ProductListItem | null>(null);

  const rows = productsQuery.data?.items ?? [];
  const total = productsQuery.data?.total ?? 0;
  const isFiltered = hasProductFilters(search);

  /** After the last row of a page is deleted, step back to the last page that still has rows. */
  useEffect(() => {
    if (productsQuery.isSuccess && !productsQuery.isPlaceholderData && rows.length === 0 && total > 0) {
      onSearchChange({ page: Math.max(1, Math.ceil(total / params.pageSize)) });
    }
  }, [productsQuery.isSuccess, productsQuery.isPlaceholderData, rows.length, total, params.pageSize, onSearchChange]);

  /** Any filter change goes back to the first page. */
  const changeFilter = (patch: Partial<ProductsSearch>) => onSearchChange({ ...patch, page: undefined });
  const resetFilters = () =>
    changeFilter({
      q: undefined,
      categoryId: undefined,
      collectionId: undefined,
      published: undefined,
      issue: undefined,
    });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <ProductsToolbar
        search={search}
        hasFilters={isFiltered}
        onChange={changeFilter}
        onReset={resetFilters}
        onCreate={() => onSearchChange({ edit: 'new' })}
      />
      <ProductsTable
        rows={rows}
        total={total}
        isFiltered={isFiltered}
        isPending={productsQuery.isPending}
        isRefreshing={productsQuery.isFetching && !productsQuery.isPending}
        error={productsQuery.error}
        page={params.page}
        pageSize={params.pageSize}
        onPageChange={(nextPage) => onSearchChange({ page: nextPage })}
        onPageSizeChange={(nextSize) => onSearchChange({ pageSize: nextSize, page: undefined })}
        onResetFilters={resetFilters}
        onCreate={() => onSearchChange({ edit: 'new' })}
        onEdit={(product) => onSearchChange({ edit: product.id })}
        onDelete={setProductToDelete}
      />
      <ProductFormDialog
        target={search.edit ?? null}
        onClose={() => onSearchChange({ edit: undefined })}
        onCreated={(productId) => onSearchChange({ edit: productId })}
        renderGallery={(productId) => <EntityGallery owner="products" ownerId={productId} hideTitle />}
      />
      <DeleteProductDialog product={productToDelete} onClose={() => setProductToDelete(null)} />
    </div>
  );
}
