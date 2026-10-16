import { Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Order } from '@/entities/order';
import { formatPhone, toTelHref } from '@/shared/lib/phone';
import { Button } from '@/shared/ui/button';

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

interface OrderCustomerCardProps {
  order: Order;
}

/** Who ordered, with one-tap call and e-mail. */
export function OrderCustomerCard({ order }: OrderCustomerCardProps) {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col gap-3 rounded-xl border bg-card p-4">
      <h3 className="text-sm font-semibold text-muted-foreground">{t('admin.orders.sheet.customer')}</h3>
      <div className="flex items-center gap-3">
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground"
          aria-hidden
        >
          {getInitials(order.contactName)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold">{order.contactName}</p>
          <p className="text-sm text-muted-foreground tabular-nums">{formatPhone(order.phone)}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <a href={toTelHref(order.phone)}>
            <Phone aria-hidden />
            {t('admin.orders.sheet.call')}
          </a>
        </Button>
        {order.email ? (
          <Button asChild variant="outline" size="sm">
            <a href={`mailto:${order.email}`}>
              <Mail aria-hidden />
              {order.email}
            </a>
          </Button>
        ) : null}
      </div>
    </section>
  );
}
