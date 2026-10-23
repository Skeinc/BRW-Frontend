import { FileText, Pencil, Plus, SearchX, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ArticleListItem } from '@/entities/article';
import { getApiErrorMessage } from '@/shared/api';
import { formatDateTime } from '@/shared/lib/format-date-time';
import { TABLE_PAGE_SIZES } from '@/shared/lib/table-search';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { DataTable, type DataTableColumn } from '@/shared/ui/data-table';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';

interface ArticlesTableProps {
  rows: ArticleListItem[];
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
  onEdit: (article: ArticleListItem) => void;
  onDelete: (article: ArticleListItem) => void;
}

export function ArticlesTable({
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
}: ArticlesTableProps) {
  const { t, i18n } = useTranslation();

  const columns: DataTableColumn<ArticleListItem>[] = [
    {
      id: 'title',
      header: t('admin.articles.columns.title'),
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.cover ? (
            <img src={row.cover.thumbUrl} alt="" loading="lazy" className="size-9 shrink-0 rounded object-cover" />
          ) : (
            <ImagePlaceholder kind="article" className="size-9 rounded" />
          )}
          <button type="button" className="truncate text-left font-medium hover:underline" onClick={() => onEdit(row)}>
            {row.title}
          </button>
        </div>
      ),
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
    {
      id: 'publishedAt',
      header: t('admin.articles.columns.publishedAt'),
      cell: (row) => (row.publishedAt ? formatDateTime(row.publishedAt, i18n.language) : '—'),
      className: 'text-muted-foreground tabular-nums',
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
        title: t(isFiltered ? 'admin.common.nothingFound' : 'admin.articles.empty.title'),
        description: t(isFiltered ? 'admin.common.nothingFoundHint' : 'admin.articles.empty.description'),
        icon: isFiltered ? SearchX : FileText,
        action: isFiltered ? (
          <Button variant="outline" onClick={onResetFilters}>
            <X aria-hidden />
            {t('admin.filters.reset')}
          </Button>
        ) : (
          <Button onClick={onCreate}>
            <Plus aria-hidden />
            {t('admin.articles.create')}
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
