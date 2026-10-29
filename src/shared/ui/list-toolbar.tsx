import { SlidersHorizontal, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/shared/lib/use-mobile';
import { Button } from './button';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from './sheet';

interface ListToolbarProps {
  /** The search box: always visible. */
  search: ReactNode;
  /** The filters: inline on a wide screen, in a "Filters" bottom sheet on a phone. */
  filters?: ReactNode;
  /** Whether a search or a filter is on; shows "Reset". */
  isFiltered: boolean;
  /** How many filters (not counting the search) are on; shown on the phone "Filters" button. */
  activeFilterCount?: number;
  onReset: () => void;
  /** Main buttons, for example "Create": at the right end of the row. */
  actions?: ReactNode;
  /** For many filters: search and actions in the first row, the filters below in a grid of equal columns. */
  stackFilters?: boolean;
}

/**
 * First row of an admin list screen. Wide screen: search and filters on the left, actions on the right.
 * Phone: search with a "Filters" button and the actions in one row; the filters open in a bottom sheet.
 */
export function ListToolbar({
  search,
  filters,
  isFiltered,
  activeFilterCount = 0,
  onReset,
  actions,
  stackFilters = false,
}: ListToolbarProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const resetButton = isFiltered ? (
    <Button type="button" variant="ghost" className="h-10" onClick={onReset}>
      <X aria-hidden />
      {t('admin.filters.reset')}
    </Button>
  ) : null;

  if (!isMobile && stackFilters && filters) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">{search}</div>
          <div className="flex shrink-0 items-center gap-2">
            {resetButton}
            {actions}
          </div>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(11rem,1fr))] gap-2">{filters}</div>
      </div>
    );
  }

  if (!isMobile) {
    return (
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {search}
          {filters}
          {resetButton}
        </div>
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="min-w-0 flex-1">{search}</div>
      {filters ? (
        <Button
          type="button"
          variant="outline"
          className="relative h-10 w-11 px-0"
          aria-label={t('admin.filters.open', { count: activeFilterCount })}
          onClick={() => setIsSheetOpen(true)}
        >
          <SlidersHorizontal aria-hidden />
          {activeFilterCount > 0 ? (
            <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground tabular-nums">
              {activeFilterCount}
            </span>
          ) : null}
        </Button>
      ) : null}
      {!filters && isFiltered ? (
        <Button
          type="button"
          variant="outline"
          className="h-10 w-11 px-0"
          aria-label={t('admin.filters.reset')}
          onClick={onReset}
        >
          <X aria-hidden />
        </Button>
      ) : null}
      {actions}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="max-h-[85svh] gap-0 rounded-t-xl">
          <SheetHeader>
            <SheetTitle>{t('admin.filters.title')}</SheetTitle>
            <SheetDescription className="sr-only">{t('admin.filters.description')}</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-3 overflow-y-auto px-4 pb-4 [&_[role=combobox]]:w-full!">{filters}</div>
          <SheetFooter className="grid grid-cols-2 gap-2 border-t">
            <Button type="button" variant="outline" disabled={!isFiltered} onClick={onReset}>
              {t('admin.filters.reset')}
            </Button>
            <Button type="button" onClick={() => setIsSheetOpen(false)}>
              {t('admin.filters.done')}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
