import { Check, Play, RotateCcw, XCircle, type LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ORDER_STATUS_TRANSITIONS, useUpdateOrderStatus, type Order, type OrderStatus } from '@/entities/order';
import { getApiErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';

interface TransitionStyle {
  icon: LucideIcon;
  variant: 'default' | 'outline';
  isDestructive?: boolean;
}

/** Looks of the buttons: moving the order forward is the main action, cancelling and going back are quiet. */
const TRANSITION_STYLES: Record<string, TransitionStyle> = {
  new_in_progress: { icon: Play, variant: 'default' },
  in_progress_done: { icon: Check, variant: 'default' },
  new_cancelled: { icon: XCircle, variant: 'outline', isDestructive: true },
  in_progress_cancelled: { icon: XCircle, variant: 'outline', isDestructive: true },
  done_in_progress: { icon: RotateCcw, variant: 'outline' },
  cancelled_new: { icon: RotateCcw, variant: 'outline' },
};

interface OrderActionsProps {
  order: Order;
}

/** One button per status the order can move to, named by what it does. */
export function OrderActions({ order }: OrderActionsProps) {
  const { t } = useTranslation();
  const update = useUpdateOrderStatus();
  const targets: readonly OrderStatus[] = ORDER_STATUS_TRANSITIONS[order.status];

  return (
    <div className="flex flex-wrap items-center gap-2 border-t bg-background px-4 py-3 max-sm:[&>*]:flex-1">
      {targets.toReversed().map((target) => {
        const key = `${order.status}_${target}`;
        const style = TRANSITION_STYLES[key];
        const Icon = style.icon;
        return (
          <Button
            key={target}
            type="button"
            variant={style.variant}
            className={style.isDestructive ? 'text-destructive hover:text-destructive' : undefined}
            disabled={update.isPending}
            loading={update.isPending && update.variables?.status === target}
            onClick={() =>
              update.mutate(
                { id: order.id, status: target },
                {
                  onSuccess: () => toast.success(t('admin.orders.statusChanged')),
                  onError: (error) => toast.error(getApiErrorMessage(error, t)),
                },
              )
            }
          >
            <Icon aria-hidden />
            {t(`admin.orders.actions.${key}`)}
          </Button>
        );
      })}
    </div>
  );
}
