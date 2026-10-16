import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CategorySelect } from '@/entities/category';
import { CollectionSelect } from '@/entities/collection';
import { ListToolbar } from '@/shared/ui/list-toolbar';
import { SearchInput } from '@/shared/ui/search-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { ToolbarButton } from '@/shared/ui/toolbar-button';
import type { ProductsSearch } from '../model/products-search';

const ALL = 'all';

interface ProductsToolbarProps {
  search: ProductsSearch;
  hasFilters: boolean;
  onChange: (patch: Partial<ProductsSearch>) => void;
  onReset: () => void;
  onCreate: () => void;
}

export function ProductsToolbar({ search, hasFilters, onChange, onReset, onCreate }: ProductsToolbarProps) {
  const { t } = useTranslation();
  return (
    <ListToolbar
      isFiltered={hasFilters}
      activeFilterCount={
        Number(Boolean(search.categoryId)) + Number(Boolean(search.collectionId)) + Number(Boolean(search.published))
      }
      onReset={onReset}
      search={
        <SearchInput
          className="w-full md:w-64"
          value={search.q ?? ''}
          placeholder={t('admin.products.searchPlaceholder')}
          onChange={(q) => onChange({ q: q || undefined })}
        />
      }
      filters={
        <>
          <CategorySelect
            className="h-10 w-52"
            value={search.categoryId ?? ''}
            noneLabel={t('admin.products.filters.categoryAll')}
            ariaLabel={t('admin.products.filters.categoryLabel')}
            onValueChange={(categoryId) => onChange({ categoryId: categoryId || undefined })}
          />
          <CollectionSelect
            className="h-10 w-48"
            value={search.collectionId ?? ''}
            noneLabel={t('admin.products.filters.collectionAll')}
            ariaLabel={t('admin.products.filters.collectionLabel')}
            onValueChange={(collectionId) => onChange({ collectionId: collectionId || undefined })}
          />
          <Select
            value={search.published ?? ALL}
            onValueChange={(value) => onChange({ published: value === ALL ? undefined : (value as 'yes' | 'no') })}
          >
            <SelectTrigger className="h-10 w-40" aria-label={t('admin.filters.statusLabel')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{t('admin.filters.statusAll')}</SelectItem>
              <SelectItem value="yes">{t('admin.filters.statusPublished')}</SelectItem>
              <SelectItem value="no">{t('admin.filters.statusHidden')}</SelectItem>
            </SelectContent>
          </Select>
        </>
      }
      actions={<ToolbarButton icon={Plus} label={t('admin.products.create')} onClick={onCreate} />}
    />
  );
}
