import { FolderTree, Pencil, Plus, SearchX, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Category } from '@/entities/category';
import { getApiErrorMessage } from '@/shared/api';
import { TABLE_PAGE_SIZES } from '@/shared/lib/table-search';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { DataTable, type DataTableColumn } from '@/shared/ui/data-table';
import { CategoryNameCell } from './category-name-cell';

interface CategoriesTableProps {
  /** The categories of the current page, already searched and filtered by the API. */
  rows: Category[];
  total: number;
  /** Under a search or filter the tree is shown flat and can not be reordered. */
  isFiltered: boolean;
  isPending: boolean;
  isRefreshing: boolean;
  error: unknown;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onReorder: (activeId: string, overId: string) => void;
  collapsedIds: ReadonlySet<string>;
  onToggle: (category: Category) => void;
  onCreate: () => void;
  onResetFilters: () => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoriesTable({
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
  collapsedIds,
  onToggle,
  onCreate,
  onResetFilters,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  const { t } = useTranslation();

  const columns: DataTableColumn<Category>[] = [
    {
      id: 'name',
      header: t('admin.categories.columns.name'),
      cell: (row) => (
        <CategoryNameCell
          category={row}
          isTree={!isFiltered}
          isExpanded={!collapsedIds.has(row.id)}
          onToggle={onToggle}
        />
      ),
    },
    {
      id: 'products',
      header: t('admin.categories.columns.products'),
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

  const getDeleteBlockReason = (row: Category): string | undefined => {
    if (row.childCount > 0) {
      return t('admin.categories.deleteBlocked.hasChildren');
    }
    return row.productCount > 0 ? t('admin.categories.deleteBlocked.hasProducts') : undefined;
  };

  return (
    <DataTable
      fillHeight
      columns={columns}
      data={rows}
      getRowId={(row) => row.id}
      isLoading={isPending}
      isRefreshing={isRefreshing}
      error={error ? getApiErrorMessage(error, t) : undefined}
      empty={{
        title: t(isFiltered ? 'admin.common.nothingFound' : 'admin.categories.empty.title'),
        description: t(isFiltered ? 'admin.common.nothingFoundHint' : 'admin.categories.empty.description'),
        icon: isFiltered ? SearchX : FolderTree,
        action: isFiltered ? (
          <Button variant="outline" onClick={onResetFilters}>
            <X aria-hidden />
            {t('admin.filters.reset')}
          </Button>
        ) : (
          <Button onClick={onCreate}>
            <Plus aria-hidden />
            {t('admin.categories.create')}
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
        getGroupKey: (row) => row.parentId ?? 'root',
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
            disabled: (row) => getDeleteBlockReason(row) !== undefined,
            disabledReason: getDeleteBlockReason,
            onSelect: onDelete,
          },
        ],
      }}
    />
  );
}
