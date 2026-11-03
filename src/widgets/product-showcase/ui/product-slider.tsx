import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductCard, type CatalogProductCard } from '@/entities/product';
import { ProductCardCartButton } from '@/features/add-to-cart';
import { Button } from '@/shared/ui/button';
import { useScrollEdges } from '../model/use-scroll-edges';
import { ShowcaseHeading } from './showcase-heading';

/** Not the `disabled` attribute: Firefox restores it on reload and it no longer matches the server HTML. */
const ARROW_CLASS = 'size-11 aria-disabled:pointer-events-none aria-disabled:opacity-50';

interface ProductSliderProps {
  id: string;
  /** Key prefix in `pages.home.*` with `eyebrow`, `title`, `previous` and `next`. */
  textKey: string;
  products: readonly CatalogProductCard[];
  highlight?: 'new';
}

export function ProductSlider({ id, textKey, products, highlight }: ProductSliderProps) {
  const { t } = useTranslation();
  const listRef = useRef<HTMLUListElement>(null);
  const { canScrollBack, canScrollForward } = useScrollEdges(listRef, products.length > 0);
  const scrollByPage = (direction: -1 | 1) => {
    const list = listRef.current;
    list?.scrollBy({ left: direction * list.clientWidth, behavior: 'smooth' });
  };
  return (
    <section aria-labelledby={id} className="mx-auto w-full max-w-6xl px-4">
      <ShowcaseHeading id={id} eyebrow={t(`${textKey}.eyebrow`)} title={t(`${textKey}.title`)}>
        <div className="hidden gap-2 sm:flex">
          <Button
            variant="outline"
            size="icon"
            className={ARROW_CLASS}
            aria-disabled={!canScrollBack}
            tabIndex={canScrollBack ? undefined : -1}
            onClick={() => canScrollBack && scrollByPage(-1)}
            aria-label={t(`${textKey}.previous`)}
          >
            <ChevronLeft aria-hidden />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={ARROW_CLASS}
            aria-disabled={!canScrollForward}
            tabIndex={canScrollForward ? undefined : -1}
            onClick={() => canScrollForward && scrollByPage(1)}
            aria-label={t(`${textKey}.next`)}
          >
            <ChevronRight aria-hidden />
          </Button>
        </div>
      </ShowcaseHeading>
      <ul
        ref={listRef}
        className="-mx-4 mt-6 flex scroll-pl-4 snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <li key={product.id} className="w-[70%] shrink-0 snap-start sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]">
            <ProductCard product={product} highlight={highlight} footer={<ProductCardCartButton product={product} />} />
          </li>
        ))}
      </ul>
    </section>
  );
}
