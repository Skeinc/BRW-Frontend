import { MapPin, Store, Truck, Wallet, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { Order } from '@/entities/order';

interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}

function InfoRow({ icon: Icon, label, children }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
        aria-hidden
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-words">{children}</p>
      </div>
    </div>
  );
}

interface OrderDeliveryCardProps {
  order: Order;
}

/** How the order is received and paid for. */
export function OrderDeliveryCard({ order }: OrderDeliveryCardProps) {
  const { t } = useTranslation();
  const address = [order.city, order.address].filter(Boolean).join(', ');
  return (
    <section className="flex flex-col gap-4 rounded-xl border bg-card p-4">
      <h3 className="text-sm font-semibold text-muted-foreground">{t('admin.orders.sheet.delivery')}</h3>
      <InfoRow
        icon={order.deliveryMethod === 'delivery' ? Truck : Store}
        label={t('admin.orders.sheet.deliveryMethod')}
      >
        {t(`admin.orders.deliveryMethods.${order.deliveryMethod}`)}
      </InfoRow>
      {address ? (
        <InfoRow icon={MapPin} label={t('admin.orders.sheet.address')}>
          {address}
        </InfoRow>
      ) : null}
      <InfoRow icon={Wallet} label={t('admin.orders.sheet.payment')}>
        {t(`admin.orders.paymentMethods.${order.paymentMethod}`)}
      </InfoRow>
    </section>
  );
}
