import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ListToolbar } from '@/shared/ui/list-toolbar';
import { SearchInput } from '@/shared/ui/search-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { ToolbarButton } from '@/shared/ui/toolbar-button';
import type { NewsSearch } from '../model/news-search';

const ALL = 'all';

interface NewsToolbarProps {
  search: NewsSearch;
  hasFilters: boolean;
  onChange: (patch: Partial<NewsSearch>) => void;
  onReset: () => void;
  onCreate: () => void;
}

export function NewsToolbar({ search, hasFilters, onChange, onReset, onCreate }: NewsToolbarProps) {
  const { t } = useTranslation();
  return (
    <ListToolbar
      isFiltered={hasFilters}
      activeFilterCount={Number(Boolean(search.published)) + Number(Boolean(search.promo))}
      onReset={onReset}
      search={
        <SearchInput
          className="w-full md:w-64"
          value={search.q ?? ''}
          placeholder={t('admin.news.searchPlaceholder')}
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
            value={search.promo ?? ALL}
            onValueChange={(value) => onChange({ promo: value === ALL ? undefined : (value as 'yes' | 'no') })}
          >
            <SelectTrigger className="h-10 w-40" aria-label={t('admin.news.filters.promoLabel')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{t('admin.news.filters.promoAll')}</SelectItem>
              <SelectItem value="yes">{t('admin.news.filters.promoOnly')}</SelectItem>
              <SelectItem value="no">{t('admin.news.filters.promoNone')}</SelectItem>
            </SelectContent>
          </Select>
        </>
      }
      actions={<ToolbarButton icon={Plus} label={t('admin.news.create')} onClick={onCreate} />}
    />
  );
}
