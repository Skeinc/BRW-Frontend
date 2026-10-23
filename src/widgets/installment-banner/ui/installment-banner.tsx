import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/button';

export function InstallmentBanner() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto w-full max-w-7xl px-4">
      <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground md:p-12">
        <div aria-hidden className="absolute -top-16 -right-16 size-72 rounded-full bg-primary-foreground/10" />
        <div aria-hidden className="absolute -right-4 -bottom-24 size-72 rounded-full bg-primary-foreground/10" />
        <div className="relative max-w-xl">
          <p className="text-xs font-semibold tracking-widest uppercase opacity-80">
            {t('pages.home.installment.eyebrow')}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{t('pages.home.installment.title')}</h2>
          <p className="mt-3 opacity-90">{t('pages.home.installment.text')}</p>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="mt-6 h-12 bg-foreground px-6 text-background hover:bg-foreground/90"
          >
            <Link to="/installment">
              {t('pages.home.installment.cta')}
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
