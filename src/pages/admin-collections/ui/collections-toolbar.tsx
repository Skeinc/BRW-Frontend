import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ListToolbar } from '@/shared/ui/list-toolbar';
import { SearchInput } from '@/shared/ui/search-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { ToolbarButton } from '@/shared/ui/toolbar-button';
import type { CollectionsSearch } from '../model/collections-search';

const ALL = 'all';

interface CollectionsToolbarProps {
  search: CollectionsSearch;
  hasFilters: boolean;
  onChange: (patch: Partial<CollectionsSearch>) => void;
  onReset: () => void;
  onCreate: () => void;
}

export function CollectionsToolbar({ search, hasFilters, onChange, onReset, onCreate }: CollectionsToolbarProps) {
  const { t } = useTranslation();
  return (
    <ListToolbar
      isFiltered={hasFilters}
      activeFilterCount={Number(Boolean(search.published)) + Number(Boolean(search.contents))}
      onReset={onReset}
      search={
        <SearchInput
          className="w-full md:w-64"
          value={search.q ?? ''}
          placeholder={t('admin.collections.searchPlaceholder')}
          onChange={(q) => onChange({ q: q || undefined })}
        />
      }
      filters={
        <>
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
          <Select
            value={search.contents ?? ALL}
            onValueChange={(value) => onChange({ contents: value === ALL ? undefined : (value as 'with' | 'empty') })}
          >
            <SelectTrigger className="h-10 w-44" aria-label={t('admin.collections.filters.contentsLabel')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{t('admin.collections.filters.contentsAll')}</SelectItem>
              <SelectItem value="with">{t('admin.collections.filters.withProducts')}</SelectItem>
              <SelectItem value="empty">{t('admin.collections.filters.empty')}</SelectItem>
            </SelectContent>
          </Select>
        </>
      }
      actions={<ToolbarButton icon={Plus} label={t('admin.collections.create')} onClick={onCreate} />}
    />
  );
}
