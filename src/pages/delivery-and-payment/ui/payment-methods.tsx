import { Banknote, CreditCard, MapPin, Store } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/shared/ui/badge';
import { DeliverySection } from './delivery-section';

export function PaymentMethods() {
  const { t } = useTranslation();
  const base = 'pages.deliveryAndPayment.payment';
  return (
    <DeliverySection id="payment" heading={t(`${base}.heading`)} lead={t(`${base}.lead`)}>
      <ul className="grid gap-4 md:grid-cols-3">
        <li className="rounded-xl border bg-card p-6">
          <Banknote aria-hidden className="size-8 text-primary" />
          <h3 className="mt-4 text-lg font-semibold">{t(`${base}.courier.title`)}</h3>
          <p className="mt-2 text-muted-foreground">{t(`${base}.courier.text`)}</p>
        </li>
        <li className="rounded-xl border bg-card p-6">
          <Store aria-hidden className="size-8 text-primary" />
          <h3 className="mt-4 text-lg font-semibold">{t(`${base}.pickup.title`)}</h3>
          <p className="mt-2 text-muted-foreground">{t(`${base}.pickup.text`)}</p>
          <p className="mt-4 flex items-start gap-2 text-sm font-semibold">
            <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
            {t('stores.nepokorennykh.address')}
          </p>
          <p className="mt-1 pl-6 text-sm text-muted-foreground">
            {t(`${base}.pickup.hours`, { hours: t('footer.hours') })}
          </p>
        </li>
        <li className="rounded-xl border border-dashed bg-card/50 p-6">
          <CreditCard aria-hidden className="size-8 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold text-muted-foreground">{t(`${base}.card.title`)}</h3>
          <p className="mt-2 text-muted-foreground">{t(`${base}.card.text`)}</p>
          <Badge variant="secondary" className="mt-4">
            {t(`${base}.card.badge`)}
          </Badge>
        </li>
      </ul>
    </DeliverySection>
  );
}
