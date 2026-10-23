import { Link } from '@tanstack/react-router';
import { LayoutGrid, Phone, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SITE_PHONE } from '@/shared/config';
import { toTelHref } from '@/shared/lib/phone';
import { Button } from '@/shared/ui/button';
import { PageBreadcrumbs } from '@/shared/ui/page-breadcrumbs';

export function CartPage() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <PageBreadcrumbs current={t('nav.cart')} />
      <div className="flex flex-col items-center py-12 text-center md:py-20">
        <span
          aria-hidden
          className="flex size-24 items-center justify-center rounded-full bg-muted text-muted-foreground"
        >
          <ShoppingCart className="size-10" strokeWidth={1.5} />
        </span>
        <h1 className="mt-8 text-3xl font-bold tracking-tight md:text-4xl">{t('pages.cart.heading')}</h1>
        <p className="mt-4 max-w-md text-balance text-muted-foreground">{t('pages.cart.lead')}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="h-11 px-6">
            <Link to="/catalog">
              <LayoutGrid aria-hidden />
              {t('pages.cart.catalog')}
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-11 px-6">
            <a href={toTelHref(SITE_PHONE)}>
              <Phone aria-hidden />
              {t('pages.cart.call')}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
