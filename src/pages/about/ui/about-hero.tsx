import { Link } from '@tanstack/react-router';
import { LayoutGrid } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/button';

export function AboutHero() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
      <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{t('pages.about.heading')}</h1>
      <p className="mt-6 max-w-3xl text-lg text-muted-foreground">{t('pages.about.lead')}</p>
      <p className="mt-8 max-w-2xl border-l-4 border-primary pl-4 text-xl font-semibold">{t('pages.about.slogan')}</p>
      <Button asChild className="mt-8 h-12 px-6">
        <Link to="/catalog">
          <LayoutGrid aria-hidden />
          {t('pages.about.cta')}
        </Link>
      </Button>
    </section>
  );
}
