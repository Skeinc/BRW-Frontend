import { ErrorState } from '@/shared/ui/error-state';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { catalogCategoriesQueryOptions, CategoryTile } from '@/entities/category';
import { BreadcrumbTrail } from '@/shared/ui/breadcrumb-trail';

export function CatalogPage() {
  const { t } = useTranslation();
  const { data: categories, isError, error, refetch, isFetching } = useQuery(catalogCategoriesQueryOptions);
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <BreadcrumbTrail steps={[{ label: t('nav.catalog') }]} />
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t('pages.catalog.heading')}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t('pages.catalog.lead')}</p>
      {isError ? (
        <div className="mt-8">
          <ErrorState error={error} onRetry={() => void refetch()} isRetrying={isFetching} />
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {(categories ?? []).map((category) => (
            <li key={category.id}>
              <CategoryTile category={category} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
