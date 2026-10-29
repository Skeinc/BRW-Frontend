import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { CatalogSolution } from '@/entities/room';
import { formatPrice } from '@/shared/lib/format-price';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';

interface SolutionCardProps {
  solution: CatalogSolution;
}

export function SolutionCard({ solution }: SolutionCardProps) {
  const { t, i18n } = useTranslation();
  const [cover] = solution.images;
  return (
    <article className="grid gap-6 rounded-xl border bg-card p-4 md:grid-cols-2 md:p-6">
      <div className="aspect-4/3 overflow-hidden rounded-lg bg-muted">
        {cover ? (
          <img
            src={cover.url}
            alt={cover.alt ?? solution.name}
            width={cover.width}
            height={cover.height}
            loading="lazy"
            className="size-full object-contain"
          />
        ) : (
          <ImagePlaceholder kind="collection" className="size-full" iconClassName="size-1/4" />
        )}
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold tracking-tight">{solution.name}</h3>
        {solution.price && (
          <p className="text-2xl font-bold tabular-nums">
            <span className="mr-2 text-sm font-normal text-muted-foreground">{t('rooms.solutionPrice')}</span>
            {formatPrice(solution.price, i18n.language)}
          </p>
        )}
        {solution.description && <p className="text-sm text-muted-foreground">{solution.description}</p>}
        {solution.products.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold">{t('rooms.elements')}</h4>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {solution.products.map((product) => (
                <li key={product.id}>
                  <Link
                    to="/product/$productId"
                    params={{ productId: product.id }}
                    className="group flex flex-col gap-1 text-sm"
                  >
                    <span className="aspect-square overflow-hidden rounded-md bg-muted">
                      {product.image ? (
                        <img
                          src={product.image.thumbUrl}
                          alt=""
                          width={product.image.width}
                          height={product.image.height}
                          loading="lazy"
                          className="size-full object-contain"
                        />
                      ) : null}
                    </span>
                    <span className="line-clamp-2 group-hover:text-primary">{product.name}</span>
                    <span className="font-semibold tabular-nums">{formatPrice(product.price, i18n.language)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
