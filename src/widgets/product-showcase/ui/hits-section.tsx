import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { catalogProductsQueryOptions, HITS_PARAMS } from '@/entities/product';
import { HitsGrid } from './hits-grid';
import { ShowcaseHeading } from './showcase-heading';

export function HitsSection() {
  const { t } = useTranslation();
  const { data, isError } = useQuery(catalogProductsQueryOptions(HITS_PARAMS));
  if (isError || data?.items.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby="home-hits" className="mx-auto w-full max-w-7xl px-4">
      <ShowcaseHeading id="home-hits" eyebrow={t('pages.home.hits.eyebrow')} title={t('pages.home.hits.title')}>
        <Link to="/catalog" className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary">
          {t('pages.home.hits.all')}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </ShowcaseHeading>
      <HitsGrid products={data?.items} />
    </section>
  );
}
