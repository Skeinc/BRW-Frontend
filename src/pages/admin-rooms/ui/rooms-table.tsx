import { Pencil, Plus, Sofa, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Room } from '@/entities/room';
import { getApiErrorMessage } from '@/shared/api';
import { TABLE_PAGE_SIZES } from '@/shared/lib/table-search';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { DataTable, type DataTableColumn } from '@/shared/ui/data-table';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';

interface RoomsTableProps {
  /** The rooms of the current page, already searched and filtered by the API. */
  rows: Room[];
  total: number;
  isPending: boolean;
  isRefreshing: boolean;
  error: unknown;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onReorder: (activeId: string, overId: string) => void;
  onCreate: () => void;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
}

export function RoomsTable({
  rows,
  total,
  isPending,
  isRefreshing,
  error,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onReorder,
  onCreate,
  onEdit,
  onDelete,
}: RoomsTableProps) {
  const { t } = useTranslation();

  const columns: DataTableColumn<Room>[] = [
    {
      id: 'name',
      header: t('admin.rooms.columns.name'),
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.cover ? (
            <img src={row.cover.thumbUrl} alt="" loading="lazy" className="size-8 shrink-0 rounded object-cover" />
          ) : (
            <ImagePlaceholder kind="room" className="size-8 rounded" />
          )}
          <span className="truncate font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      id: 'solutions',
      header: t('admin.rooms.columns.solutions'),
      cell: (row) => row.solutionCount,
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
        title: t('admin.rooms.empty.title'),
        description: t('admin.rooms.empty.description'),
        icon: Sofa,
        action: (
          <Button onClick={onCreate}>
            <Plus aria-hidden />
            {t('admin.rooms.create')}
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
        enabled: true,
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
            disabled: (row) => row.solutionCount > 0,
            disabledReason: t('admin.rooms.deleteBlocked'),
            onSelect: onDelete,
          },
        ],
      }}
    />
  );
}
