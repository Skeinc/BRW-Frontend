import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { catalogCollectionSolutionsQueryOptions } from '@/entities/room';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';

interface ProductCollectionSolutionsProps {
  collection: { id: string; name: string };
}

/** Thumbnails of the ready-made solutions of the product's collection; each opens the collection page in its room. */
export function ProductCollectionSolutions({ collection }: ProductCollectionSolutionsProps) {
  const { t } = useTranslation();
  const { data: solutions = [] } = useQuery(catalogCollectionSolutionsQueryOptions(collection.id));
  if (solutions.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby="product-solutions" className="rounded-lg bg-muted p-4">
      <h2 id="product-solutions" className="mb-3 text-lg font-semibold">
        {t('rooms.readySolutions', { name: collection.name })}
      </h2>
      <ul className="flex gap-3 overflow-x-auto pb-1">
        {solutions.map((solution) => (
          <li key={solution.id} className="w-40 shrink-0">
            <Link
              to="/room/$roomId/$collectionId"
              params={{ roomId: solution.roomId, collectionId: collection.id }}
              search={{ solution: solution.id }}
              className="group flex flex-col gap-1 text-sm"
            >
              <span className="aspect-4/3 overflow-hidden rounded-md bg-card">
                {solution.image ? (
                  <img
                    src={solution.image.thumbUrl}
                    alt=""
                    width={solution.image.width}
                    height={solution.image.height}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder kind="collection" className="size-full" iconClassName="size-1/4" />
                )}
              </span>
              <span className="line-clamp-2 group-hover:text-primary">{solution.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
