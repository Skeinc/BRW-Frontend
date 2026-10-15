import { Link } from '@tanstack/react-router';
import { Banknote, CalendarClock, ChevronRight, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FACTS = [
  { key: 'area', icon: MapPin },
  { key: 'term', icon: CalendarClock },
  { key: 'payment', icon: Banknote },
] as const;

export function DeliveryHero() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-6 pt-12 md:pb-8 md:pt-16">
      <nav aria-label={t('pages.deliveryAndPayment.nav.breadcrumbs')} className="mb-6 text-sm text-muted-foreground">
        <ol className="flex items-center gap-1">
          <li>
            <Link to="/" className="hover:text-primary">
              {t('nav.home')}
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-4" />
          </li>
          <li aria-current="page" className="font-semibold text-foreground">
            {t('pages.deliveryAndPayment.heading')}
          </li>
        </ol>
      </nav>
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
