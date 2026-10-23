import { Link, getRouteApi } from '@tanstack/react-router';
import { CheckCircle2, LayoutGrid, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SITE_PHONE } from '@/shared/config';
import { toTelHref } from '@/shared/lib/phone';
import { Button } from '@/shared/ui/button';

const route = getRouteApi('/order/$number');
const STEPS = ['call', 'confirm', 'delivery'] as const;

export function OrderSuccessPage() {
  const { t } = useTranslation();
  const { number } = route.useParams();
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-12 text-center md:py-20">
      <CheckCircle2 aria-hidden className="size-16 text-emerald-600" strokeWidth={1.5} />
      <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">{t('order.heading')}</h1>
      <p className="mt-3 text-muted-foreground">{t('order.numberLabel')}</p>
      <p className="tabular-price mt-1 text-3xl font-bold text-primary">{number}</p>
      <h2 className="mt-10 text-lg font-semibold">{t('order.nextTitle')}</h2>
      <ol className="mt-4 flex w-full flex-col gap-3 text-left">
        {STEPS.map((step, index) => (
          <li key={step} className="flex gap-3 rounded-xl border bg-card p-4">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {index + 1}
            </span>
            <span className="text-sm">{t(`order.steps.${step}`)}</span>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button asChild className="h-11 px-6">
          <Link to="/catalog">
            <LayoutGrid aria-hidden />
            {t('order.toCatalog')}
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-11 px-6">
          <a href={toTelHref(SITE_PHONE)}>
            <Phone aria-hidden />
            {t('order.call')}
          </a>
        </Button>
      </div>
    </section>
  );
}
