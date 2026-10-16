import { ChevronsDownUp, ChevronsUpDown, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MAX_CATEGORY_DEPTH } from '@/entities/category';
import { ListToolbar } from '@/shared/ui/list-toolbar';
import { SearchInput } from '@/shared/ui/search-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { ToolbarButton } from '@/shared/ui/toolbar-button';
import type { CategoriesSearch } from '../model/categories-search';

const ALL = 'all';
const LEVELS = Array.from({ length: MAX_CATEGORY_DEPTH }, (_, index) => index + 1);

interface CategoriesToolbarProps {
  search: CategoriesSearch;
  hasFilters: boolean;
  /** Whether any category on the page has subcategories, so collapsing makes sense. */
  canCollapse: boolean;
  isCollapsed: boolean;
  onChange: (patch: Partial<CategoriesSearch>) => void;
  onReset: () => void;
  onCreate: () => void;
  onToggleAll: () => void;
}

export function CategoriesToolbar({
  search,
  hasFilters,
  canCollapse,
  isCollapsed,
  onChange,
  onReset,
  onCreate,
  onToggleAll,
}: CategoriesToolbarProps) {
  const { t } = useTranslation();
  return (
    <ListToolbar
      isFiltered={hasFilters}
      activeFilterCount={Number(Boolean(search.published)) + Number(Boolean(search.level))}
      onReset={onReset}
      search={
        <SearchInput
          className="w-full md:w-64"
          value={search.q ?? ''}
          placeholder={t('admin.categories.searchPlaceholder')}
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
            value={search.level ? String(search.level) : ALL}
            onValueChange={(value) => onChange({ level: value === ALL ? undefined : Number(value) })}
          >
            <SelectTrigger className="h-10 w-40" aria-label={t('admin.categories.filters.levelLabel')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{t('admin.categories.filters.levelAll')}</SelectItem>
              {LEVELS.map((level) => (
                <SelectItem key={level} value={String(level)}>
                  {t('admin.categories.filters.level', { level })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      }
      actions={
        <>
          {!hasFilters && canCollapse ? (
            <ToolbarButton
              variant="outline"
              icon={isCollapsed ? ChevronsUpDown : ChevronsDownUp}
              label={t(isCollapsed ? 'admin.categories.expandAll' : 'admin.categories.collapseAll')}
              onClick={onToggleAll}
            />
          ) : null}
          <ToolbarButton icon={Plus} label={t('admin.categories.create')} onClick={onCreate} />
        </>
      }
    />
  );
}
