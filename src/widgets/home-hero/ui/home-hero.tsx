import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Phone } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import { catalogProductsQueryOptions, NEW_ARRIVALS_PARAMS } from '@/entities/product';
import { SITE_PHONE } from '@/shared/config';
import { toTelHref } from '@/shared/lib/phone';
import { Button } from '@/shared/ui/button';
import { HeroFeaturedCard } from './hero-featured-card';
import { HeroStats } from './hero-stats';

const HERO_IMAGE_SRC = '/hero-placeholder.svg';
const HERO_IMAGE_WIDTH = 720;
const HERO_IMAGE_HEIGHT = 560;

export function HomeHero() {
  const { t } = useTranslation();
  const { data } = useQuery(catalogProductsQueryOptions(NEW_ARRIVALS_PARAMS));
  const featured = data?.items[0];
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-6 md:pt-8">
      <div className="relative grid items-center gap-10 overflow-hidden rounded-3xl border bg-linear-to-br from-card via-card to-primary/10 p-6 md:p-10 lg:grid-cols-2 lg:gap-12 lg:p-14">
        <div aria-hidden className="absolute -top-24 -left-24 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <h1 className="text-4xl font-extrabold tracking-tight text-balance md:text-5xl lg:text-6xl">
            <Trans i18nKey="pages.home.hero.title" components={{ accent: <span className="text-primary" /> }} />
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">{t('pages.home.hero.lead')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 px-6 shadow-lg shadow-primary/25">
              <Link to="/catalog">
                {t('pages.home.hero.catalog')}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 bg-card px-6">
              <a href={toTelHref(SITE_PHONE)}>
                <Phone aria-hidden />
                {t('pages.home.hero.call')}
              </a>
            </Button>
          </div>
          <HeroStats />
        </div>
        <div className="relative">
          <img
            src={HERO_IMAGE_SRC}
            alt=""
            width={HERO_IMAGE_WIDTH}
            height={HERO_IMAGE_HEIGHT}
            fetchPriority="high"
            className="relative aspect-9/7 w-full rounded-3xl bg-muted object-cover"
          />
          {featured && <HeroFeaturedCard product={featured} />}
        </div>
      </div>
    </section>
  );
}
