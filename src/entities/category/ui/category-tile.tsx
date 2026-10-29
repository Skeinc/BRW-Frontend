import { Link } from '@tanstack/react-router';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';
import type { CatalogCategory } from '../model/catalog-types';

interface CategoryTileProps {
  category: CatalogCategory;
}

export function CategoryTile({ category }: CategoryTileProps) {
  const { id, name, imageUrl } = category;
  return (
    <Link
      to="/catalog/$categoryId"
      params={{ categoryId: id }}
      className="group relative block aspect-4/3 overflow-hidden rounded-xl border bg-white transition-colors hover:border-primary/60"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          width={800}
          height={600}
          loading="lazy"
          className="size-full object-contain p-4 pb-14 transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <ImagePlaceholder kind="category" className="size-full" iconClassName="size-1/4" />
      )}
      <p className="absolute inset-x-0 bottom-0 line-clamp-2 bg-foreground/55 px-4 py-3 font-medium text-white transition-colors group-hover:bg-primary/80">
        {name}
      </p>
    </Link>
  );
}
