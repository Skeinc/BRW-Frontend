import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { orderQueryOptions, OrderStatusBadge } from '@/entities/order';
import { getApiErrorMessage } from '@/shared/api';
import { formatDateTime } from '@/shared/lib/format-date-time';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shared/ui/sheet';
import { Skeleton } from '@/shared/ui/skeleton';
import { OrderDetails } from './order-details';

interface OrderSheetProps {
  /** The order to show; the panel is open while it is set. */
  orderId: string | undefined;
  onClose: () => void;
}

export function OrderSheet({ orderId, onClose }: OrderSheetProps) {
  const { t, i18n } = useTranslation();
  const orderQuery = useQuery({ ...orderQueryOptions(orderId ?? ''), enabled: orderId !== undefined });
  const order = orderQuery.data;

  return (
    <Sheet
      open={orderId !== undefined}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <SheetContent onOpenAutoFocus={(event) => event.preventDefault()} className="w-full gap-0 p-0 sm:max-w-xl">
        <SheetHeader className="gap-1 border-b p-4 pr-14 text-left">
          <div className="flex items-center gap-3">
            <SheetTitle className="font-mono text-lg">{order?.number ?? t('admin.orders.sheet.title')}</SheetTitle>
            {order ? <OrderStatusBadge status={order.status} /> : null}
          </div>
          <SheetDescription>
            {order
              ? t('admin.orders.sheet.subtitle', {
                  date: formatDateTime(order.createdAt, i18n.language),
                  count: order.items.length,
                })
              : t('admin.orders.sheet.description')}
          </SheetDescription>
        </SheetHeader>
        {orderQuery.isPending ? (
          <div className="flex flex-col gap-3 p-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : null}
        {orderQuery.isError ? (
          <p role="alert" className="p-4 text-sm text-destructive">
            {getApiErrorMessage(orderQuery.error, t)}
          </p>
        ) : null}
        {order ? <OrderDetails order={order} /> : null}
      </SheetContent>
    </Sheet>
  );
}
