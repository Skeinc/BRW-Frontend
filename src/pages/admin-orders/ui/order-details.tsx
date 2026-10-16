import { StickyNote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Order } from '@/entities/order';
import { OrderActions } from './order-actions';
import { OrderCustomerCard } from './order-customer-card';
import { OrderDeliveryCard } from './order-delivery-card';
import { OrderItemsCard } from './order-items-card';
import { OrderProgress } from './order-progress';

interface OrderDetailsProps {
  order: Order;
}

/** Body of the order panel: progress, customer, receiving, the customer's note, items; the actions stay at the bottom. */
export function OrderDetails({ order }: OrderDetailsProps) {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-muted/20 p-4">
        <OrderProgress status={order.status} />
        <OrderCustomerCard order={order} />
        <OrderDeliveryCard order={order} />
        {order.comment ? (
          <section className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
            <StickyNote className="mt-0.5 size-5 shrink-0 text-amber-700" aria-hidden />
            <div>
              <h3 className="text-sm font-semibold">{t('admin.orders.sheet.commentTitle')}</h3>
              <p className="mt-1 text-sm break-words">{order.comment}</p>
            </div>
          </section>
        ) : null}
        <OrderItemsCard order={order} />
      </div>
      <OrderActions order={order} />
    </>
  );
}
