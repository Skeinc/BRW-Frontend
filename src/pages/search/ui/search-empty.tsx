import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Phone, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { catalogProductsQueryOptions, HITS_PARAMS } from '@/entities/product';
import { ProductGrid } from '@/widgets/product-catalog';
import { SITE_PHONE } from '@/shared/config';
import { toTelHref } from '@/shared/lib/phone';
import { Button } from '@/shared/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia } from '@/shared/ui/empty';

const SUGGESTIONS_COUNT = 4;

interface SearchEmptyProps {
  /** Empty when nothing has been typed yet. */
  query: string;
}

export function SearchEmpty({ query }: SearchEmptyProps) {
  const { t } = useTranslation();
  const { data: hits } = useQuery(catalogProductsQueryOptions(HITS_PARAMS));
  const popular = t('pages.search.popularQueries', { returnObjects: true });
  const popularQueries = Array.isArray(popular)
    ? popular.filter((item): item is string => typeof item === 'string')
    : [];
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-12">
      <Empty>
        <EmptyHeader className="max-w-xl">
          <EmptyMedia variant="icon" className="size-20 rounded-full [&_svg:not([class*='size-'])]:size-9">
            <Search aria-hidden />
          </EmptyMedia>
          <h1 className="text-3xl font-bold tracking-tight">
            {query ? t('pages.search.nothingFound', { q: query }) : t('pages.search.emptyQuery')}
          </h1>
          <EmptyDescription>{t('pages.search.nothingFoundHint')}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="max-w-xl gap-6">
          {popularQueries.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">{t('pages.search.popular')}</span>
              {popularQueries.map((item) => (
                <Link
                  key={item}
                  to="/search"
                  search={{ q: item }}
                  className="inline-flex min-h-11 items-center rounded-full border bg-card px-4 text-sm hover:border-primary/40"
                >
                  {item}
                </Link>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-11 px-6">
              <Link to="/catalog">
                <ArrowRight aria-hidden />
                {t('pages.search.toCatalog')}
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 px-6">
              <a href={toTelHref(SITE_PHONE)}>
                <Phone aria-hidden />
                {t('pages.search.call')}
              </a>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
      {hits && hits.items.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">{t('pages.search.mayInterest')}</h2>
          <ProductGrid products={hits.items.slice(0, SUGGESTIONS_COUNT)} className="lg:grid-cols-4" />
        </div>
      )}
    </section>
  );
}
