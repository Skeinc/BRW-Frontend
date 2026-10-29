import { Link } from '@tanstack/react-router';
import { ArrowRight, AtSign, CalendarDays, Package, type LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SITE_INSTAGRAM_HANDLE, SITE_INSTAGRAM_URL, SITE_STORES } from '@/shared/config';
import { Button } from '@/shared/ui/button';

interface AboutFigure {
  icon: LucideIcon;
  value: string;
  label: string;
}

/** "About the company" block of the home page: text and the store map on top, key figures, Instagram and the shop text below. */
export function AboutTeaser() {
  const { t } = useTranslation();
  const [store] = SITE_STORES;
  const figures: AboutFigure[] = [
    { icon: CalendarDays, value: t('pages.about.facts.years'), label: t('pages.about.facts.yearsLabel') },
    { icon: Package, value: t('pages.about.facts.items'), label: t('pages.about.facts.itemsLabel') },
  ];
  const conveniences = t('pages.home.about.conveniences', { returnObjects: true }) as string[];
  return (
    <section aria-labelledby="home-about" className="mx-auto w-full max-w-7xl px-4">
      <div className="border-y py-6 md:py-8">
        <h2 id="home-about" className="text-2xl font-bold tracking-tight md:text-3xl">
          {t('pages.home.about.title')}
        </h2>
        <div className="mt-6 grid gap-x-12 gap-y-8 lg:grid-cols-2">
          <div className="space-y-4 text-muted-foreground">
            <p>{t('pages.home.about.p1')}</p>
            <p>{t('pages.home.about.p2')}</p>
            <p>{t('pages.home.about.p3')}</p>
            <p className="font-semibold text-foreground">{t('pages.about.slogan')}</p>
          </div>
          {store && (
            <iframe
              src={store.mapEmbedUrl}
              title={t('pages.about.stores.mapTitle', { address: t(`stores.${store.id}.address`) })}
              className="h-80 w-full rounded-xl border-0 lg:h-full lg:min-h-64"
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )}
          <dl className="grid grid-cols-2 gap-4 self-start">
            {figures.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-4 rounded-xl border bg-card p-6">
                <Icon aria-hidden className="size-8 shrink-0 text-primary" />
                <div>
                  <dd className="tabular-price text-2xl font-bold">{value}</dd>
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                </div>
              </div>
            ))}
            <a
              href={SITE_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 flex items-center gap-4 rounded-xl border bg-card p-6 transition-colors hover:bg-muted"
            >
              <AtSign aria-hidden className="size-8 shrink-0 text-primary" />
              <div>
                <dd className="text-2xl font-bold">{SITE_INSTAGRAM_HANDLE}</dd>
                <dt className="text-sm text-muted-foreground">{t('pages.about.stores.instagram')}</dt>
              </div>
            </a>
          </dl>
          <div className="flex flex-col items-start gap-4 text-muted-foreground">
            <p>{t('pages.home.about.shop')}</p>
            <p>{t('pages.home.about.conveniencesLead')}</p>
            <ul className="list-disc space-y-1 pl-5">
              {conveniences.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Button asChild variant="outline">
              <Link to="/about">
                {t('pages.home.about.more')}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
