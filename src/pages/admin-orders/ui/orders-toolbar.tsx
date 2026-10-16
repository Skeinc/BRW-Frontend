import { useTranslation } from 'react-i18next';
import { ORDER_STATUSES, type OrderStatus } from '@/entities/order';
import { useIsMobile } from '@/shared/lib/use-mobile';
import { ListToolbar } from '@/shared/ui/list-toolbar';
import { SearchInput } from '@/shared/ui/search-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import type { OrdersSearch } from '../model/orders-search';

const ALL = 'all';

interface OrdersToolbarProps {
  search: OrdersSearch;
  hasFilters: boolean;
  onChange: (patch: Partial<OrdersSearch>) => void;
  onReset: () => void;
}

/** Statuses are tabs on a wide screen and a select in the filters sheet on a phone. */
export function OrdersToolbar({ search, hasFilters, onChange, onReset }: OrdersToolbarProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const setStatus = (value: string) => onChange({ status: value === ALL ? undefined : (value as OrderStatus) });

  return (
    <ListToolbar
      isFiltered={hasFilters}
      activeFilterCount={Number(Boolean(search.status))}
      onReset={onReset}
      search={
        <SearchInput
          className="w-full md:w-64"
          value={search.q ?? ''}
          placeholder={t('admin.orders.searchPlaceholder')}
          onChange={(q) => onChange({ q: q || undefined })}
        />
      }
      filters={
        isMobile ? (
          <Select value={search.status ?? ALL} onValueChange={setStatus}>
            <SelectTrigger className="h-10 w-44" aria-label={t('admin.orders.sheet.status')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{t('admin.orders.statusAll')}</SelectItem>
              {ORDER_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {t(`admin.orders.statuses.${status}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Tabs value={search.status ?? ALL} onValueChange={setStatus}>
            <TabsList className="h-10 w-fit">
              <TabsTrigger value={ALL}>{t('admin.orders.statusAll')}</TabsTrigger>
              {ORDER_STATUSES.map((status) => (
                <TabsTrigger key={status} value={status}>
                  {t(`admin.orders.statuses.${status}`)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )
      }
    />
  );
}
