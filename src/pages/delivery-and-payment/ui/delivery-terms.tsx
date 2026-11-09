import { CalendarClock, DoorOpen, TriangleAlert, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Callout } from '@/shared/ui/callout';
import { PageSection } from '@/shared/ui/page-section';
import { useDeliveryContent } from '../model/use-delivery-content';

const TERM_ICONS = [Wallet, CalendarClock, DoorOpen] as const;

export function DeliveryTerms() {
  const { t } = useTranslation();
  const base = 'pages.deliveryAndPayment.delivery';
  const cards = useDeliveryContent().delivery;
  return (
    <PageSection id="delivery" heading={t(`${base}.heading`)} lead={t(`${base}.lead`)}>
      <ul className="grid gap-4 md:grid-cols-3">
        {cards.map((card, index) => {
          const Icon = TERM_ICONS[index] ?? Wallet;
          return (
            <li key={index} className="rounded-xl border bg-card p-6">
              <Icon aria-hidden className="size-8 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{card.title}</h3>
              <p className="mt-2 text-muted-foreground">{card.text}</p>
            </li>
          );
        })}
      </ul>
      <div className="mt-4">
        <Callout icon={TriangleAlert} tone="warning" title={t(`${base}.warning.title`)}>
          <p>{t(`${base}.warning.lift`)}</p>
          <p>{t(`${base}.warning.unload`)}</p>
        </Callout>
      </div>
    </PageSection>
  );
}
