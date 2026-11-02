import { useTranslation } from 'react-i18next';
import type { CatalogSolution } from '@/entities/room';
import { AddSetToCartButton } from '@/features/add-to-cart';
import { formatPrice } from '@/shared/lib/format-price';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';

interface SolutionDetailsProps {
  solution: CatalogSolution;
}

/** The selected ready-made solution: big photo on the left, name, price and the "add the set" button on the right. */
export function SolutionDetails({ solution }: SolutionDetailsProps) {
  const { t, i18n } = useTranslation();
  const [cover] = solution.images;
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <div className="aspect-4/3 overflow-hidden rounded-lg bg-muted">
        {cover ? (
          <img
            src={cover.url}
            alt={cover.alt ?? solution.name}
            width={cover.width}
            height={cover.height}
            className="size-full object-contain"
          />
        ) : (
          <ImagePlaceholder kind="collection" className="size-full" iconClassName="size-1/4" />
        )}
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight">{solution.name}</h2>
        {solution.description && <p className="text-sm text-muted-foreground">{solution.description}</p>}
        {solution.price && (
          <p className="text-2xl font-bold tabular-nums">
            <span className="mr-2 text-sm font-normal text-muted-foreground">{t('rooms.solutionPrice')}</span>
            {formatPrice(solution.price, i18n.language)}
          </p>
        )}
        {solution.products.length > 0 && <AddSetToCartButton products={solution.products} className="h-11 w-full" />}
      </div>
    </div>
  );
}
