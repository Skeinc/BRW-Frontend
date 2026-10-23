import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { catalogCollectionQueryOptions } from '@/entities/collection';
import { ProductCatalog } from '@/widgets/product-catalog';
import { BreadcrumbTrail } from '@/shared/ui/breadcrumb-trail';
import { CollapsibleText } from '@/shared/ui/collapsible-text';

const route = getRouteApi('/collection/$collectionId');

export function CollectionPage() {
  const { t } = useTranslation();
  const { collectionId } = route.useParams();
  const search = { ...route.useSearch(), collection: undefined };
  const navigate = route.useNavigate();
  const { data: collection } = useSuspenseQuery(catalogCollectionQueryOptions(collectionId));
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <BreadcrumbTrail steps={collection.breadcrumbs.map((step) => ({ label: step.name }))} />
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{collection.name}</h1>
        <p className="text-muted-foreground">{t('catalog.productsCount', { count: collection.productCount })}</p>
      </div>
      <div className="mt-6">
        <ProductCatalog
          search={search}
          pinned={{ collection: collection.slug }}
          onSearchChange={(next) => void navigate({ search: next })}
        />
      </div>
      {collection.description && (
        <div className="mt-12 max-w-3xl">
          <h2 className="mb-3 text-xl font-bold tracking-tight">
            {t('catalog.aboutCollection', { name: collection.name })}
          </h2>
          <CollapsibleText text={collection.description} />
        </div>
      )}
    </section>
  );
}
