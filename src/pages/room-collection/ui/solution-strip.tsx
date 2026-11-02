import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { CatalogSolution } from '@/entities/room';
import { cn } from '@/shared/lib/utils';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';

interface SolutionStripProps {
  collectionName: string;
  solutions: CatalogSolution[];
  selectedId: string;
}

/** Thumbnails of the ready-made solutions of the collection; the choice lives in the `solution` search param. */
export function SolutionStrip({ collectionName, solutions, selectedId }: SolutionStripProps) {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="ready-solutions" className="rounded-lg bg-muted p-4">
      <h2 id="ready-solutions" className="mb-3 text-lg font-semibold">
        {t('rooms.readySolutions', { name: collectionName })}
      </h2>
      <ul className="flex gap-3 overflow-x-auto pb-1">
        {solutions.map((solution) => {
          const [cover] = solution.images;
          const isSelected = solution.id === selectedId;
          return (
            <li key={solution.id} className="w-36 shrink-0">
              <Link
                to="."
                search={(prev) => ({ ...prev, solution: solution.id })}
                resetScroll={false}
                aria-current={isSelected ? 'true' : undefined}
                className="group flex flex-col gap-1 text-sm"
              >
                <span
                  className={cn(
                    'aspect-4/3 overflow-hidden rounded-md border-2 bg-card',
                    isSelected ? 'border-primary' : 'border-transparent group-hover:border-primary/50',
                  )}
                >
                  {cover ? (
                    <img
                      src={cover.thumbUrl}
                      alt=""
                      width={cover.width}
                      height={cover.height}
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  ) : (
                    <ImagePlaceholder kind="collection" className="size-full" iconClassName="size-1/4" />
                  )}
                </span>
                <span className={cn('line-clamp-2', isSelected && 'font-semibold text-primary')}>{solution.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
