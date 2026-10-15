import { Banknote, CalendarClock, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageBreadcrumbs } from '@/shared/ui/page-breadcrumbs';

const FACTS = [
  { key: 'area', icon: MapPin },
  { key: 'term', icon: CalendarClock },
  { key: 'payment', icon: Banknote },
] as const;

export function DeliveryHero() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-6 pt-12 md:pb-8 md:pt-16">
      <PageBreadcrumbs current={t('pages.deliveryAndPayment.heading')} />
      <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{t('pages.deliveryAndPayment.heading')}</h1>
      <p className="mt-6 max-w-3xl text-lg text-muted-foreground">{t('pages.deliveryAndPayment.lead')}</p>
      <ul className="mt-8 flex flex-wrap gap-3">
        {FACTS.map(({ key, icon: Icon }) => (
          <li
            key={key}
            className="flex min-h-11 items-center gap-2 rounded-full border bg-card px-4 text-sm font-semibold"
          >
            <Icon aria-hidden className="size-4 text-primary" />
            {t(`pages.deliveryAndPayment.facts.${key}`)}
          </li>
        ))}
      </ul>
    </section>
  );
}
