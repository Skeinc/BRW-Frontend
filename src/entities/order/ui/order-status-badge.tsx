import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/utils';
import type { OrderStatus } from '../model/types';

const STATUS_CLASSES: Record<OrderStatus, string> = {
  new: 'bg-primary text-primary-foreground',
  in_progress: 'bg-amber-100 text-amber-900',
  done: 'bg-emerald-100 text-emerald-900',
  cancelled: 'bg-muted text-muted-foreground',
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        STATUS_CLASSES[status],
      )}
    >
      {t(`admin.orders.statuses.${status}`)}
    </span>
  );
}
