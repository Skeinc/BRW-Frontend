import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { CatalogSolutionProduct } from '@/entities/room';
import { formatPrice } from '@/shared/lib/format-price';

interface SolutionElementsProps {
  products: CatalogSolutionProduct[];
}

export function SolutionElements({ products }: SolutionElementsProps) {
  const { t, i18n } = useTranslation();
  return (
    <section aria-labelledby="selected-elements">
      <h2 id="selected-elements" className="mb-4 text-xl font-bold tracking-tight">
        {t('rooms.selectedElements')}
      </h2>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <li key={product.id}>
            <Link
              to="/product/$productId"
              params={{ productId: product.id }}
              className="group flex h-full flex-col gap-2 rounded-lg border bg-card p-3 text-sm"
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
              <span className="mt-auto font-semibold tabular-nums">{formatPrice(product.price, i18n.language)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
