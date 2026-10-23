import { useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { catalogProductsQueryOptions, countActiveFilters, toCatalogParams } from '@/entities/product';
import { ProductCatalog } from '@/widgets/product-catalog';
import { SearchEmpty } from './search-empty';

const route = getRouteApi('/search');

export function SearchPage() {
  const { t } = useTranslation();
  const search = route.useSearch();
  const navigate = route.useNavigate();
  const query = search.q?.trim() ?? '';
  const { data } = useQuery({ ...catalogProductsQueryOptions(toCatalogParams(search)), enabled: query !== '' });
  const isEmpty = query === '' || (data?.total === 0 && countActiveFilters(search) === 0);
  if (isEmpty) {
    return <SearchEmpty query={query} />;
  }
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <p className="text-xs font-semibold tracking-widest text-primary uppercase">{t('pages.search.eyebrow')}</p>
      <h1 className="mt-1 mb-6 text-2xl font-bold tracking-tight md:text-4xl">
        {data ? t('pages.search.found', { q: query, count: data.total }) : t('pages.search.searching', { q: query })}
      </h1>
      <ProductCatalog search={search} showCollections onSearchChange={(next) => void navigate({ search: next })} />
    </section>
  );
}
