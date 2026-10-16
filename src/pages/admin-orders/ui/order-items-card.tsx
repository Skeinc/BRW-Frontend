import { Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Order } from '@/entities/order';
import { formatPrice } from '@/shared/lib/format-price';

/** Price of a line for display only (in kopecks, so the sum has no float noise); the order total comes from the API. */
function getLineTotal(unitPrice: string, quantity: number): string {
  return ((Math.round(Number(unitPrice) * 100) * quantity) / 100).toFixed(2);
}

interface OrderItemsCardProps {
  order: Order;
}

export function OrderItemsCard({ order }: OrderItemsCardProps) {
  const { t, i18n } = useTranslation();
  return (
    <section className="flex flex-col gap-3 rounded-xl border bg-card p-4">
      <h3 className="text-sm font-semibold text-muted-foreground">
        {t('admin.orders.sheet.items')} · {order.items.length}
      </h3>
      <ul className="flex flex-col divide-y">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 py-3 first:pt-0">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
              aria-hidden
            >
              <Package className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              {item.sku ? <p className="text-xs text-muted-foreground">{item.sku}</p> : null}
              <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                {item.quantity} × {formatPrice(item.unitPrice, i18n.language)}
              </p>
            </div>
            <p className="shrink-0 text-sm font-semibold tabular-nums">
              {formatPrice(getLineTotal(item.unitPrice, item.quantity), i18n.language)}
            </p>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t pt-3">
        <span className="font-semibold">{t('admin.orders.sheet.total')}</span>
        <span className="text-lg font-bold tabular-nums">{formatPrice(order.total, i18n.language)}</span>
      </div>
    </section>
  );
}
