import { Boxes, Pencil, Plus, SearchX, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Solution } from '@/entities/solution';
import { getApiErrorMessage } from '@/shared/api';
import { TABLE_PAGE_SIZES } from '@/shared/lib/table-search';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { DataTable, type DataTableColumn } from '@/shared/ui/data-table';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';

interface SolutionsTableProps {
  /** The solutions of the current page, already searched and filtered by the API. */
  rows: Solution[];
  total: number;
  isFiltered: boolean;
  isPending: boolean;
  isRefreshing: boolean;
  error: unknown;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onCreate: () => void;
  onResetFilters: () => void;
  onEdit: (solution: Solution) => void;
  onDelete: (solution: Solution) => void;
}

export function SolutionsTable({
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
  onCreate,
  onResetFilters,
  onEdit,
  onDelete,
}: SolutionsTableProps) {
  const { t } = useTranslation();

  const columns: DataTableColumn<Solution>[] = [
    {
      id: 'name',
      header: t('admin.solutions.columns.name'),
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.cover ? (
            <img src={row.cover.thumbUrl} alt="" loading="lazy" className="size-8 shrink-0 rounded object-cover" />
          ) : (
            <ImagePlaceholder kind="solution" className="size-8 rounded" />
          )}
          <span className="truncate font-medium">{row.name}</span>
        </div>
      ),
    },
    { id: 'room', header: t('admin.solutions.columns.room'), cell: (row) => row.roomName },
    { id: 'collection', header: t('admin.solutions.columns.collection'), cell: (row) => row.collectionName },
    {
      id: 'price',
      header: t('admin.solutions.columns.price'),
      cell: (row) => t('admin.solutions.priceValue', { price: Number(row.price) }),
      className: 'tabular-nums',
    },
    {
      id: 'products',
      header: t('admin.solutions.columns.products'),
      cell: (row) => row.productCount,
      className: 'tabular-nums',
    },
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
        title: t(isFiltered ? 'admin.common.nothingFound' : 'admin.solutions.empty.title'),
        description: t(isFiltered ? 'admin.common.nothingFoundHint' : 'admin.solutions.empty.description'),
        icon: isFiltered ? SearchX : Boxes,
        action: isFiltered ? (
          <Button variant="outline" onClick={onResetFilters}>
            <X aria-hidden />
            {t('admin.filters.reset')}
          </Button>
        ) : (
          <Button onClick={onCreate}>
            <Plus aria-hidden />
            {t('admin.solutions.create')}
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
          { id: 'edit', label: t('admin.common.edit'), icon: Pencil, onSelect: onEdit },
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
