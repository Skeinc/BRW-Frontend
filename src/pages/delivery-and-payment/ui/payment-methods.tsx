import { Link } from '@tanstack/react-router';
import { ArrowRight, Banknote, CreditCard, MapPin, Store } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { isPaymentActive } from '@/entities/delivery-page';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { PageSection } from '@/shared/ui/page-section';
import { useDeliveryContent } from '../model/use-delivery-content';

const PAYMENT_ICONS = [Banknote, Store, CreditCard] as const;
const PICKUP_INDEX = 1;

export function PaymentMethods() {
  const { t } = useTranslation();
  const base = 'pages.deliveryAndPayment.payment';
  const { payment } = useDeliveryContent();
  return (
    <PageSection id="payment" heading={t(`${base}.heading`)} lead={t(`${base}.lead`)}>
      <ul className="grid gap-4 md:grid-cols-3">
        {payment.map((method, index) => {
          const active = isPaymentActive(method, index);
          const Icon = PAYMENT_ICONS[index] ?? Banknote;
          return (
            <li key={index} className={cn('rounded-xl border p-6', active ? 'bg-card' : 'border-dashed bg-card/50')}>
              <Icon aria-hidden className={cn('size-8', active ? 'text-primary' : 'text-muted-foreground')} />
              <h3 className={cn('mt-4 text-lg font-semibold', !active && 'text-muted-foreground')}>{method.title}</h3>
              <p className="mt-2 text-muted-foreground">{method.text}</p>
              {index === PICKUP_INDEX ? (
                <>
                  <p className="mt-4 flex items-start gap-2 text-sm font-semibold">
                    <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                    {t('stores.nepokorennykh.address')}
                  </p>
                  <p className="mt-1 pl-6 text-sm text-muted-foreground">
                    {t(`${base}.pickup.hours`, { hours: t('footer.hours') })}
                  </p>
                </>
              ) : null}
              {active ? null : (
                <Badge variant="secondary" className="mt-4">
                  {t(`${base}.card.badge`)}
                </Badge>
              )}
            </li>
          );
        })}
      </ul>
      <Link
        to="/installment"
        className="mt-4 flex min-h-11 items-center gap-2 font-semibold text-primary hover:underline"
      >
        {t(`${base}.installmentLink`)}
        <ArrowRight aria-hidden className="size-4" />
      </Link>
    </PageSection>
  );
}
