import { Inbox, SearchX, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { OrderStatusBadge, type OrderListItem } from '@/entities/order';
import { getApiErrorMessage } from '@/shared/api';
import { formatDateTime } from '@/shared/lib/format-date-time';
import { formatPrice } from '@/shared/lib/format-price';
import { formatPhone } from '@/shared/lib/phone';
import { TABLE_PAGE_SIZES } from '@/shared/lib/table-search';
import { Button } from '@/shared/ui/button';
import { DataTable, type DataTableColumn } from '@/shared/ui/data-table';

interface OrdersTableProps {
  rows: OrderListItem[];
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
  onOpen: (order: OrderListItem) => void;
}

export function OrdersTable({
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
  onOpen,
}: OrdersTableProps) {
  const { t, i18n } = useTranslation();

  const columns: DataTableColumn<OrderListItem>[] = [
    {
      id: 'number',
      header: t('admin.orders.columns.number'),
      cell: (row) => (
        <button type="button" className="font-mono font-medium hover:underline" onClick={() => onOpen(row)}>
          {row.number}
        </button>
      ),
    },
    {
      id: 'date',
      header: t('admin.orders.columns.date'),
      cell: (row) => formatDateTime(row.createdAt, i18n.language),
      className: 'text-muted-foreground tabular-nums',
    },
    { id: 'name', header: t('admin.orders.columns.name'), cell: (row) => row.contactName },
    {
      id: 'phone',
      header: t('admin.orders.columns.phone'),
      cell: (row) => formatPhone(row.phone),
      className: 'whitespace-nowrap tabular-nums',
    },
    {
      id: 'total',
      header: t('admin.orders.columns.total'),
      cell: (row) => formatPrice(row.total, i18n.language),
      className: 'font-medium tabular-nums',
    },
    { id: 'status', header: t('admin.orders.columns.status'), cell: (row) => <OrderStatusBadge status={row.status} /> },
  ];

  return (
    <DataTable
      fillHeight
      columns={columns}
      data={rows}
      getRowId={(row) => row.id}
      isLoading={isPending}
      isRefreshing={isRefreshing}
      error={error ? getApiErrorMessage(error, t) : undefined}
      onRowClick={onOpen}
      empty={{
        title: t(isFiltered ? 'admin.common.nothingFound' : 'admin.orders.empty.title'),
        description: t(isFiltered ? 'admin.common.nothingFoundHint' : 'admin.orders.empty.description'),
        icon: isFiltered ? SearchX : Inbox,
        action: isFiltered ? (
          <Button variant="outline" onClick={onResetFilters}>
            <X aria-hidden />
            {t('admin.filters.reset')}
          </Button>
        ) : undefined,
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
    />
  );
}
