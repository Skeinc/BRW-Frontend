import { ChevronsDownUp, ChevronsUpDown, Plus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MAX_CATEGORY_DEPTH } from '@/entities/category';
import { Button } from '@/shared/ui/button';
import { ListToolbar } from '@/shared/ui/list-toolbar';
import { SearchInput } from '@/shared/ui/search-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
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
      filters={
        <>
          <SearchInput
            className="w-full sm:w-64"
            value={search.q ?? ''}
            placeholder={t('admin.categories.searchPlaceholder')}
            onChange={(q) => onChange({ q: q || undefined })}
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
          {hasFilters ? (
            <Button type="button" variant="ghost" className="h-10" onClick={onReset}>
              <X aria-hidden />
              {t('admin.filters.reset')}
            </Button>
          ) : null}
        </>
      }
      actions={
        <>
          {!hasFilters && canCollapse ? (
            <Button type="button" variant="outline" className="h-10" onClick={onToggleAll}>
              {isCollapsed ? <ChevronsUpDown aria-hidden /> : <ChevronsDownUp aria-hidden />}
              {t(isCollapsed ? 'admin.categories.expandAll' : 'admin.categories.collapseAll')}
            </Button>
          ) : null}
          <Button className="h-10" onClick={onCreate}>
            <Plus aria-hidden />
            {t('admin.categories.create')}
          </Button>
        </>
      }
    />
  );
}
