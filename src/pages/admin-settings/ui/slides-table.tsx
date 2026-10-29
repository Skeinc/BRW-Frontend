import { GalleryHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Slide } from '@/entities/slide';
import { getApiErrorMessage } from '@/shared/api';
import { TABLE_PAGE_SIZES } from '@/shared/lib/table-search';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { DataTable, type DataTableColumn } from '@/shared/ui/data-table';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';

interface SlidesTableProps {
  rows: Slide[];
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
  onEdit: (slide: Slide) => void;
  onDelete: (slide: Slide) => void;
}

export function SlidesTable({
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
}: SlidesTableProps) {
  const { t } = useTranslation();

  const columns: DataTableColumn<Slide>[] = [
    {
      id: 'alt',
      header: t('admin.slides.columns.alt'),
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.cover ? (
            <img src={row.cover.thumbUrl} alt="" loading="lazy" className="h-10 w-24 shrink-0 rounded object-cover" />
          ) : (
            <ImagePlaceholder kind="slide" className="h-10 w-24 rounded" />
          )}
          <div className="min-w-0">
            <p className="truncate font-medium">{row.alt}</p>
            {row.cover ? null : <p className="text-xs text-muted-foreground">{t('admin.slides.noImage')}</p>}
          </div>
        </div>
      ),
    },
    {
      id: 'link',
      header: t('admin.slides.columns.link'),
      cell: (row) => <span className="truncate text-muted-foreground">{row.linkUrl ?? t('admin.slides.noLink')}</span>,
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
        title: t('admin.slides.empty.title'),
        description: t('admin.slides.empty.description'),
        icon: GalleryHorizontal,
        action: (
          <Button onClick={onCreate}>
            <Plus aria-hidden />
            {t('admin.slides.create')}
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
            onSelect: onDelete,
          },
        ],
      }}
    />
  );
}
