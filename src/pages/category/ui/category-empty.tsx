import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { PackageOpen, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { catalogCategoriesQueryOptions, CategoryTile } from '@/entities/category';
import { SITE_PHONE } from '@/shared/config';
import { toTelHref } from '@/shared/lib/phone';
import { Button } from '@/shared/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty';

const SIMILAR_COUNT = 4;

interface CategoryEmptyProps {
  categoryId: string;
  /** Root of the category branch; the similar categories are taken from the other branches. */
  rootId: string | undefined;
}

export function CategoryEmpty({ categoryId, rootId }: CategoryEmptyProps) {
  const { t } = useTranslation();
  const { data: tree } = useQuery(catalogCategoriesQueryOptions);
  const similar = (tree ?? [])
    .filter((category) => category.id !== categoryId && category.id !== rootId)
    .slice(0, SIMILAR_COUNT);
  return (
    <div className="flex flex-col gap-12">
      <Empty className="border-2 bg-card/40">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="size-16 rounded-full bg-primary/10 text-primary">
            <PackageOpen aria-hidden />
          </EmptyMedia>
          <EmptyTitle className="text-2xl">{t('catalog.emptyCategory.title')}</EmptyTitle>
          <EmptyDescription>{t('catalog.emptyCategory.description')}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center">
          <Button asChild className="h-11 px-6">
            <Link to="/catalog">{t('catalog.emptyCategory.allCategories')}</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 px-6">
            <a href={toTelHref(SITE_PHONE)}>
              <Phone aria-hidden />
              {t('catalog.emptyCategory.call')}
            </a>
          </Button>
        </EmptyContent>
      </Empty>
      {similar.length > 0 && (
        <section aria-labelledby="similar-categories">
          <h2 id="similar-categories" className="text-2xl font-bold tracking-tight">
            {t('catalog.similarCategories')}
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {similar.map((category) => (
              <li key={category.id}>
                <CategoryTile category={category} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
