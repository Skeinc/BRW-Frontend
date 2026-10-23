import { SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CatalogProductFacets, CatalogSearch } from '@/entities/product';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet';
import { ProductFilters } from './product-filters';

interface FiltersSheetProps {
  facets: CatalogProductFacets | undefined;
  search: CatalogSearch;
  showCollections: boolean;
  activeCount: number;
  total: number | undefined;
  onChange: (patch: Partial<CatalogSearch>) => void;
  onReset: () => void;
}

export function FiltersSheet({
  facets,
  search,
  showCollections,
  activeCount,
  total,
  onChange,
  onReset,
}: FiltersSheetProps) {
  const { t } = useTranslation();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="shrink-0 bg-card lg:hidden">
          <SlidersHorizontal aria-hidden />
          {t('catalog.filters.open')}
          {activeCount > 0 && (
            <Badge className="min-w-5 justify-center rounded-full px-1 tabular-nums">{activeCount}</Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-sm gap-0 p-0">
        <SheetHeader className="border-b">
          <SheetTitle>{t('catalog.filters.title')}</SheetTitle>
          <SheetDescription className="sr-only">{t('catalog.filters.description')}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <ProductFilters facets={facets} search={search} showCollections={showCollections} onChange={onChange} />
        </div>
        <SheetFooter className="border-t">
          <SheetClose asChild>
            <Button className="h-11">{t('catalog.filters.show', { count: total ?? 0 })}</Button>
          </SheetClose>
          {activeCount > 0 && (
            <Button variant="ghost" className="h-11" onClick={onReset}>
              {t('catalog.filters.reset')}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
