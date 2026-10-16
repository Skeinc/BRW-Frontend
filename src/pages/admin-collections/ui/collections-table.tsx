import { Layers, Pencil, Plus, SearchX, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Collection } from '@/entities/collection';
import { getApiErrorMessage } from '@/shared/api';
import { TABLE_PAGE_SIZES } from '@/shared/lib/table-search';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { DataTable, type DataTableColumn } from '@/shared/ui/data-table';

interface CollectionsTableProps {
  /** The collections of the current page, already searched and filtered by the API. */
  rows: Collection[];
  total: number;
  /** Under a search or filter the list can not be reordered. */
  isFiltered: boolean;
  isPending: boolean;
  isRefreshing: boolean;
  error: unknown;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onReorder: (activeId: string, overId: string) => void;
  onCreate: () => void;
  onResetFilters: () => void;
  onEdit: (collection: Collection) => void;
  onDelete: (collection: Collection) => void;
}

export function CollectionsTable({
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
  onReorder,
  onCreate,
  onResetFilters,
  onEdit,
  onDelete,
}: CollectionsTableProps) {
  const { t } = useTranslation();

  const columns: DataTableColumn<Collection>[] = [
    {
      id: 'name',
      header: t('admin.collections.columns.name'),
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.cover ? (
            <img src={row.cover.thumbUrl} alt="" loading="lazy" className="size-8 shrink-0 rounded object-cover" />
          ) : (
            <span className="size-8 shrink-0 rounded bg-muted" aria-hidden />
          )}
          <span className="truncate font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      id: 'products',
      header: t('admin.collections.columns.products'),
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
        title: t(isFiltered ? 'admin.common.nothingFound' : 'admin.collections.empty.title'),
        description: t(isFiltered ? 'admin.common.nothingFoundHint' : 'admin.collections.empty.description'),
        icon: isFiltered ? SearchX : Layers,
        action: isFiltered ? (
          <Button variant="outline" onClick={onResetFilters}>
            <X aria-hidden />
            {t('admin.filters.reset')}
          </Button>
        ) : (
          <Button onClick={onCreate}>
            <Plus aria-hidden />
            {t('admin.collections.create')}
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
      reorder={{
        enabled: !isFiltered,
        handleLabel: t('table.reorder.handle'),
        disabledReason: t('table.reorder.disabled'),
        onReorder,
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
            disabled: (row) => row.productCount > 0,
            disabledReason: t('admin.collections.deleteBlocked'),
            onSelect: onDelete,
          },
        ],
      }}
    />
  );
}
