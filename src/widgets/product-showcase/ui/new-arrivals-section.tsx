import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { catalogProductsQueryOptions, NEW_ARRIVALS_PARAMS, ProductCard } from '@/entities/product';
import { Button } from '@/shared/ui/button';
import { useScrollEdges } from '../model/use-scroll-edges';
import { ShowcaseHeading } from './showcase-heading';

/** Not the `disabled` attribute: Firefox restores it on reload and it no longer matches the server HTML. */
const ARROW_CLASS = 'size-11 aria-disabled:pointer-events-none aria-disabled:opacity-50';

export function NewArrivalsSection() {
  const { t } = useTranslation();
  const listRef = useRef<HTMLUListElement>(null);
  const { data } = useQuery(catalogProductsQueryOptions(NEW_ARRIVALS_PARAMS));
  const hasItems = data !== undefined && data.items.length > 0;
  const { canScrollBack, canScrollForward } = useScrollEdges(listRef, hasItems);
  if (!data || !hasItems) {
    return null;
  }
  const scrollByPage = (direction: -1 | 1) => {
    const list = listRef.current;
    list?.scrollBy({ left: direction * list.clientWidth, behavior: 'smooth' });
  };
  return (
    <section aria-labelledby="home-new-arrivals" className="mx-auto w-full max-w-7xl px-4">
      <ShowcaseHeading
        id="home-new-arrivals"
        eyebrow={t('pages.home.newArrivals.eyebrow')}
        title={t('pages.home.newArrivals.title')}
      >
        <div className="hidden gap-2 sm:flex">
          <Button
            variant="outline"
            size="icon"
            className={ARROW_CLASS}
            aria-disabled={!canScrollBack}
            tabIndex={canScrollBack ? undefined : -1}
            onClick={() => canScrollBack && scrollByPage(-1)}
            aria-label={t('pages.home.newArrivals.previous')}
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
            aria-label={t('pages.home.newArrivals.next')}
          >
            <ChevronRight aria-hidden />
          </Button>
        </div>
      </ShowcaseHeading>
      <ul
        ref={listRef}
        className="-mx-4 mt-6 flex scroll-pl-4 snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {data.items.map((product) => (
          <li key={product.id} className="w-[70%] shrink-0 snap-start sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]">
            <ProductCard product={product} highlight="new" />
          </li>
        ))}
      </ul>
    </section>
  );
}
