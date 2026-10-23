import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { catalogCategoriesQueryOptions, CategoryTile } from '@/entities/category';

const MAX_TILES = 8;

export function CategoryTiles() {
  const { t } = useTranslation();
  const { data: categories } = useQuery(catalogCategoriesQueryOptions);
  if (!categories || categories.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby="home-categories" className="mx-auto w-full max-w-7xl px-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            {t('pages.home.categories.eyebrow')}
          </p>
          <h2 id="home-categories" className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
            {t('pages.home.categories.title')}
          </h2>
        </div>
        <Link to="/catalog" className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary">
          {t('pages.home.categories.all')}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {categories.slice(0, MAX_TILES).map((category) => (
          <li key={category.id}>
            <CategoryTile category={category} />
          </li>
        ))}
      </ul>
    </section>
  );
}
