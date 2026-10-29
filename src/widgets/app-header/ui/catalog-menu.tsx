import { useQuery } from '@tanstack/react-query';
import { Link, useRouterState } from '@tanstack/react-router';
import { ChevronDown } from 'lucide-react';
import { useState, type FocusEvent, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { catalogCategoriesQueryOptions } from '@/entities/category';
import { catalogCollectionsQueryOptions } from '@/entities/collection';
import { cn } from '@/shared/lib/utils';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';
import { NAV_LINK_CLASS } from '../model/nav-links';

/** "Catalog" item with a drop-down panel (categories and collections with photos), opened on hover and focus. */
export function CatalogMenu() {
  const { t } = useTranslation();
  const { data: categories = [] } = useQuery(catalogCategoriesQueryOptions);
  const { data: collections = [] } = useQuery(catalogCollectionsQueryOptions);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  // The panel belongs to the page it was opened on, so a navigation closes it.
  const [openPathname, setOpenPathname] = useState<string | null>(null);
  const isOpen = openPathname === pathname;
  const setIsOpen = (open: boolean): void => setOpenPathname(open ? pathname : null);

  const handleBlur = (event: FocusEvent<HTMLDivElement>): void => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };
  const hasContent = categories.length > 0 || collections.length > 0;
  return (
    <div
      className="flex items-stretch"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <Link
        to="/catalog"
        aria-haspopup={hasContent ? 'true' : undefined}
        aria-expanded={hasContent ? isOpen : undefined}
        className={cn(NAV_LINK_CLASS, 'gap-1', isOpen && 'text-primary')}
        activeProps={{ className: 'border-primary text-primary' }}
      >
        {t('nav.catalog')}
        <ChevronDown aria-hidden className={cn('size-4 transition-transform', isOpen && 'rotate-180')} />
      </Link>
      {hasContent && isOpen && (
        <div className="absolute inset-x-0 top-full z-50 border-y bg-card shadow-lg">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-6 lg:grid-cols-[14rem_1fr]">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t('nav.categories')}
              </p>
              <ul className="flex flex-col gap-1">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      to="/catalog/$categoryId"
                      params={{ categoryId: category.id }}
                      className="block py-1 text-sm hover:text-primary"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/catalog" className="block py-1 text-sm font-semibold text-primary hover:underline">
                    {t('nav.allCatalog')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t('nav.collections')}
              </p>
              <ul className="grid max-h-[60vh] grid-cols-3 gap-3 overflow-y-auto xl:grid-cols-5">
                {collections.map((collection) => (
                  <li key={collection.id}>
                    <Link
                      to="/collection/$collectionId"
                      params={{ collectionId: collection.id }}
                      className="group block"
                    >
                      <div className="aspect-2/1 overflow-hidden bg-muted">
                        {collection.imageUrl ? (
                          <img
                            src={collection.imageUrl}
                            alt=""
                            width={233}
                            height={116}
                            loading="lazy"
                            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <ImagePlaceholder kind="collection" className="size-full" iconClassName="size-1/5" />
                        )}
                      </div>
                      <p className="mt-1 truncate text-center text-sm font-semibold group-hover:text-primary">
                        {collection.name}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
