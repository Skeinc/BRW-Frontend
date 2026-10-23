import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';
import type { CatalogCategory } from '../model/catalog-types';

interface CategoryTileProps {
  category: CatalogCategory;
}

export function CategoryTile({ category }: CategoryTileProps) {
  const { t } = useTranslation();
  const { id, name, imageUrl, productCount } = category;
  return (
    <Link
      to="/catalog/$categoryId"
      params={{ categoryId: id }}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary/40"
    >
      <div className="aspect-4/3 overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            width={800}
            height={600}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder kind="category" className="size-full" iconClassName="size-1/4" />
        )}
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{t('catalog.productsCount', { count: productCount })}</p>
        </div>
        <ArrowRight aria-hidden className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" />
      </div>
    </Link>
  );
}
