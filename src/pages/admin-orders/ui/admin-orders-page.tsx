import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { ordersPageQueryOptions } from '@/entities/order';
import { hasOrderFilters, toOrderListParams, type OrdersSearch } from '../model/orders-search';
import { OrderSheet } from './order-sheet';
import { OrdersTable } from './orders-table';
import { OrdersToolbar } from './orders-toolbar';

interface AdminOrdersPageProps {
  search: OrdersSearch;
  onSearchChange: (patch: Partial<OrdersSearch>) => void;
}

export function AdminOrdersPage({ search, onSearchChange }: AdminOrdersPageProps) {
  const params = toOrderListParams(search);
  const ordersQuery = useQuery({ ...ordersPageQueryOptions(params), placeholderData: keepPreviousData });

  const rows = ordersQuery.data?.items ?? [];
  const total = ordersQuery.data?.total ?? 0;
  const isFiltered = hasOrderFilters(search);

  /** After the last row of a page disappears, step back to the last page that still has rows. */
  useEffect(() => {
    if (ordersQuery.isSuccess && !ordersQuery.isPlaceholderData && rows.length === 0 && total > 0) {
      onSearchChange({ page: Math.max(1, Math.ceil(total / params.pageSize)) });
    }
  }, [ordersQuery.isSuccess, ordersQuery.isPlaceholderData, rows.length, total, params.pageSize, onSearchChange]);

  /** Any filter change goes back to the first page. */
  const changeFilter = (patch: Partial<OrdersSearch>) => onSearchChange({ ...patch, page: undefined });
  const resetFilters = () => changeFilter({ q: undefined, status: undefined });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <OrdersToolbar search={search} hasFilters={isFiltered} onChange={changeFilter} onReset={resetFilters} />
      <OrdersTable
        rows={rows}
        total={total}
        isFiltered={isFiltered}
        isPending={ordersQuery.isPending}
        isRefreshing={ordersQuery.isFetching && !ordersQuery.isPending}
        error={ordersQuery.error}
        page={params.page}
        pageSize={params.pageSize}
        onPageChange={(nextPage) => onSearchChange({ page: nextPage })}
        onPageSizeChange={(nextSize) => onSearchChange({ pageSize: nextSize, page: undefined })}
        onResetFilters={resetFilters}
        onOpen={(order) => onSearchChange({ orderId: order.id })}
      />
      <OrderSheet orderId={search.orderId} onClose={() => onSearchChange({ orderId: undefined })} />
    </div>
  );
}
