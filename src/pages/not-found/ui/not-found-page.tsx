import { Link } from '@tanstack/react-router';
import { Home, LayoutGrid } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/button';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-16 text-center md:py-28">
      <p className="text-8xl font-extrabold leading-none text-primary md:text-[10rem]" aria-hidden>
        404
      </p>
      <h1 className="mt-10 text-3xl font-bold tracking-tight md:text-4xl">{t('pages.notFound.heading')}</h1>
      <p className="mt-4 max-w-md text-muted-foreground">{t('pages.notFound.lead')}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="h-11 px-6">
          <Link to="/">
            <Home aria-hidden />
            {t('pages.notFound.home')}
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-11 px-6">
          <Link to="/catalog">
            <LayoutGrid aria-hidden />
            {t('pages.notFound.catalog')}
          </Link>
        </Button>
      </div>
    </section>
  );
}
