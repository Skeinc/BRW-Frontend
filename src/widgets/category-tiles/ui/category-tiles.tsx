import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { catalogCategoriesQueryOptions, CategoryTile } from '@/entities/category';

const MAX_TILES = 6;

export function CategoryTiles() {
  const { t } = useTranslation();
  const { data: categories } = useQuery(catalogCategoriesQueryOptions);
  if (!categories || categories.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby="home-categories" className="mx-auto w-full max-w-7xl px-4">
      <h2 id="home-categories" className="text-2xl font-bold tracking-tight md:text-3xl">
        {t('pages.home.categories.title')}
      </h2>
      <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.slice(0, MAX_TILES).map((category) => (
          <li key={category.id}>
            <CategoryTile category={category} />
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-end">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-1 text-sm font-medium tracking-wide text-primary uppercase hover:underline"
        >
          {t('pages.home.categories.more')}
          <ChevronDown aria-hidden className="size-4" />
        </Link>
      </div>
    </section>
  );
}
