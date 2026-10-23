import { useQuery } from '@tanstack/react-query';
import { Package, Pencil, Plus, SearchX, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { categoryTreeQueryOptions, getAncestorNames } from '@/entities/category';
import type { ProductListItem } from '@/entities/product';
import { getApiErrorMessage } from '@/shared/api';
import { formatPrice } from '@/shared/lib/format-price';
import { TABLE_PAGE_SIZES } from '@/shared/lib/table-search';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { DataTable, type DataTableColumn } from '@/shared/ui/data-table';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';
import { StockBadge } from './stock-badge';

interface ProductsTableProps {
  rows: ProductListItem[];
  total: number;
  isFiltered: boolean;
  isPending: boolean;
  isRefreshing: boolean;
  error: unknown;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onResetFilters: () => void;
  onCreate: () => void;
  onEdit: (product: ProductListItem) => void;
  onDelete: (product: ProductListItem) => void;
}

export function ProductsTable({
  rows,
  total,
  isFiltered,
  isPending,
  isRefreshing,
  error,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onResetFilters,
  onCreate,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const { t, i18n } = useTranslation();
  const categoryTree = useQuery(categoryTreeQueryOptions);

  const columns: DataTableColumn<ProductListItem>[] = [
    {
      id: 'name',
      header: t('admin.products.columns.name'),
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.cover ? (
            <img src={row.cover.thumbUrl} alt="" loading="lazy" className="size-9 shrink-0 rounded object-cover" />
          ) : (
            <ImagePlaceholder kind="product" className="size-9 rounded" />
          )}
          <button type="button" className="truncate text-left font-medium hover:underline" onClick={() => onEdit(row)}>
            {row.name}
          </button>
        </div>
      ),
    },
    {
      id: 'sku',
      header: t('admin.products.columns.sku'),
      cell: (row) => row.sku ?? '—',
      className: 'text-muted-foreground',
    },
    {
      id: 'category',
      header: t('admin.products.columns.category'),
      cell: (row) => {
        const ancestors = getAncestorNames(categoryTree.data ?? [], row.categoryId);
        return (
          <span>
            {ancestors.map((name) => (
              <span key={name} className="text-muted-foreground">
                {name} ›{' '}
              </span>
            ))}
            {row.categoryName}
          </span>
        );
      },
    },
    {
      id: 'collection',
      header: t('admin.products.columns.collection'),
      cell: (row) => row.collectionName ?? '—',
      className: 'text-muted-foreground',
    },
    {
      id: 'price',
      header: t('admin.products.columns.price'),
      cell: (row) => (
        <div className="flex flex-col leading-tight tabular-nums">
          <span className="font-medium">{formatPrice(row.price, i18n.language)}</span>
          {row.oldPrice ? (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(row.oldPrice, i18n.language)}
            </span>
          ) : null}
        </div>
      ),
    },
    { id: 'stock', header: t('admin.products.columns.stock'), cell: (row) => <StockBadge status={row.stockStatus} /> },
    {
      id: 'published',
      header: t('admin.common.published'),
      cell: (row) => (
        <Badge variant={row.isPublished ? 'default' : 'secondary'}>
          {t(row.isPublished ? 'admin.common.yes' : 'admin.common.no')}
        </Badge>
      ),
    },
  ];

  return (
    <DataTable
      fillHeight
      onRowClick={onEdit}
      columns={columns}
      data={rows}
      getRowId={(row) => row.id}
      isLoading={isPending}
      isRefreshing={isRefreshing}
      error={error ? getApiErrorMessage(error, t) : undefined}
      empty={{
        title: t(isFiltered ? 'admin.common.nothingFound' : 'admin.products.empty.title'),
        description: t(isFiltered ? 'admin.common.nothingFoundHint' : 'admin.products.empty.description'),
        icon: isFiltered ? SearchX : Package,
        action: isFiltered ? (
          <Button variant="outline" onClick={onResetFilters}>
            <X aria-hidden />
            {t('admin.filters.reset')}
          </Button>
        ) : (
          <Button onClick={onCreate}>
            <Plus aria-hidden />
            {t('admin.products.create')}
          </Button>
        ),
      }}
      pagination={{
        mode: 'server',
        total,
        page,
        pageSize,
        pageSizes: TABLE_PAGE_SIZES,
        onPageChange,
        onPageSizeChange,
      }}
      actions={{
        menuLabel: t('admin.common.actions'),
        items: [
          {
            id: 'edit',
            label: t('admin.common.edit'),
            icon: Pencil,
            onSelect: onEdit,
          },
          {
            id: 'delete',
            label: t('admin.common.delete'),
            icon: Trash2,
            variant: 'destructive',
            separatorBefore: true,
            onSelect: onDelete,
          },
        ],
      }}
    />
  );
}
