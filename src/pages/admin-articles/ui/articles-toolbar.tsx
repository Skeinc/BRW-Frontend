import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ListToolbar } from '@/shared/ui/list-toolbar';
import { SearchInput } from '@/shared/ui/search-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { ToolbarButton } from '@/shared/ui/toolbar-button';
import type { ArticlesSearch } from '../model/articles-search';

const ALL = 'all';

interface ArticlesToolbarProps {
  search: ArticlesSearch;
  hasFilters: boolean;
  onChange: (patch: Partial<ArticlesSearch>) => void;
  onReset: () => void;
  onCreate: () => void;
}

export function ArticlesToolbar({ search, hasFilters, onChange, onReset, onCreate }: ArticlesToolbarProps) {
  const { t } = useTranslation();
  return (
    <ListToolbar
      isFiltered={hasFilters}
      activeFilterCount={Number(Boolean(search.published))}
      onReset={onReset}
      search={
        <SearchInput
          className="w-full md:w-64"
          value={search.q ?? ''}
          placeholder={t('admin.articles.searchPlaceholder')}
          onChange={(q) => onChange({ q: q || undefined })}
        />
      }
      filters={
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
      }
      actions={<ToolbarButton icon={Plus} label={t('admin.articles.create')} onClick={onCreate} />}
    />
  );
}
