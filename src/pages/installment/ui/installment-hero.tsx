import { CalendarClock, CreditCard, Percent } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageBreadcrumbs } from '@/shared/ui/page-breadcrumbs';

const FACTS = [
  { key: 'cards', icon: CreditCard },
  { key: 'loans', icon: CalendarClock },
  { key: 'zero', icon: Percent },
] as const;

export function InstallmentHero() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-6 pt-12 md:pb-8 md:pt-16">
      <PageBreadcrumbs current={t('pages.installment.heading')} />
      <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{t('pages.installment.heading')}</h1>
      <p className="mt-6 max-w-3xl text-lg text-muted-foreground">{t('pages.installment.lead')}</p>
      <ul className="mt-8 flex flex-wrap gap-3">
        {FACTS.map(({ key, icon: Icon }) => (
          <li
            key={key}
            className="flex min-h-11 items-center gap-2 rounded-full border bg-card px-4 text-sm font-semibold"
          >
            <Icon aria-hidden className="size-4 text-primary" />
            {t(`pages.installment.facts.${key}`)}
          </li>
        ))}
      </ul>
    </section>
  );
}
