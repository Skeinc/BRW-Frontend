import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, getRouteApi } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { catalogCategoryQueryOptions } from '@/entities/category';
import { ProductCatalog } from '@/widgets/product-catalog';
import { BreadcrumbTrail } from '@/shared/ui/breadcrumb-trail';
import { CollapsibleText } from '@/shared/ui/collapsible-text';
import { CategoryEmpty } from './category-empty';

const route = getRouteApi('/catalog/$categoryId');

export function CategoryPage() {
  const { t } = useTranslation();
  const { categoryId } = route.useParams();
  const search = route.useSearch();
  const navigate = route.useNavigate();
  const { data: category } = useSuspenseQuery(catalogCategoryQueryOptions(categoryId));
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <BreadcrumbTrail
        steps={[
          { label: t('nav.catalog'), to: 'catalog' },
          ...category.breadcrumbs.map((step) => ({
            label: step.name,
            to: { categoryId: step.id },
          })),
        ]}
      />
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{category.name}</h1>
        <p className="text-muted-foreground">{t('catalog.productsCount', { count: category.productCount })}</p>
      </div>
      {category.children.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {category.children.map((child) => (
            <li key={child.id}>
              <Link
                to="/catalog/$categoryId"
                params={{ categoryId: child.id }}
                className="inline-flex min-h-11 items-center rounded-full border bg-card px-4 text-sm hover:border-primary/40"
              >
                {child.name}
                <span className="tabular-price ml-1.5 text-muted-foreground">{`· ${child.productCount}`}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6">
        <ProductCatalog
          search={search}
          pinned={{ category: category.slug }}
          showCollections
          emptyState={<CategoryEmpty categoryId={category.id} rootId={category.breadcrumbs[0]?.id} />}
          onSearchChange={(next) => void navigate({ search: next })}
        />
      </div>
      {category.description && (
        <div className="mt-12 max-w-3xl">
          <h2 className="mb-3 text-xl font-bold tracking-tight">
            {t('catalog.aboutCategory', { name: category.name })}
          </h2>
          <CollapsibleText text={category.description} />
        </div>
      )}
    </section>
  );
}
