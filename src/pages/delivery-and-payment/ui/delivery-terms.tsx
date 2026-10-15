import { CalendarClock, DoorOpen, TriangleAlert, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Callout } from '@/shared/ui/callout';
import { PageSection } from '@/shared/ui/page-section';

const TERMS = [
  { key: 'price', icon: Wallet },
  { key: 'term', icon: CalendarClock },
  { key: 'place', icon: DoorOpen },
] as const;

export function DeliveryTerms() {
  const { t } = useTranslation();
  const base = 'pages.deliveryAndPayment.delivery';
  return (
    <PageSection id="delivery" heading={t(`${base}.heading`)} lead={t(`${base}.lead`)}>
      <ul className="grid gap-4 md:grid-cols-3">
        {TERMS.map(({ key, icon: Icon }) => (
          <li key={key} className="rounded-xl border bg-card p-6">
            <Icon aria-hidden className="size-8 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">{t(`${base}.${key}.title`)}</h3>
            <p className="mt-2 text-muted-foreground">{t(`${base}.${key}.text`)}</p>
          </li>
        ))}
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
