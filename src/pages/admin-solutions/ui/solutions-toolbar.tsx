import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CollectionSelect } from '@/entities/collection';
import { RoomSelect } from '@/entities/room';
import { ListToolbar } from '@/shared/ui/list-toolbar';
import { SearchInput } from '@/shared/ui/search-input';
import { ToolbarButton } from '@/shared/ui/toolbar-button';
import type { SolutionsSearch } from '../model/solutions-search';

interface SolutionsToolbarProps {
  search: SolutionsSearch;
  hasFilters: boolean;
  onChange: (patch: Partial<SolutionsSearch>) => void;
  onReset: () => void;
  onCreate: () => void;
}

export function SolutionsToolbar({ search, hasFilters, onChange, onReset, onCreate }: SolutionsToolbarProps) {
  const { t } = useTranslation();
  return (
    <ListToolbar
      isFiltered={hasFilters}
      activeFilterCount={Number(Boolean(search.room)) + Number(Boolean(search.collection))}
      onReset={onReset}
      search={
        <SearchInput
          className="w-full md:w-64"
          value={search.q ?? ''}
          placeholder={t('admin.solutions.searchPlaceholder')}
          onChange={(q) => onChange({ q: q || undefined })}
        />
      }
      filters={
        <>
          <RoomSelect
            className="w-full md:w-44"
            value={search.room ?? ''}
            onValueChange={(room) => onChange({ room: room || undefined })}
            noneLabel={t('admin.solutions.filters.roomAll')}
            ariaLabel={t('admin.solutions.filters.roomLabel')}
          />
          <CollectionSelect
            className="w-full md:w-52"
            value={search.collection ?? ''}
            onValueChange={(collection) => onChange({ collection: collection || undefined })}
            noneLabel={t('admin.solutions.filters.collectionAll')}
            ariaLabel={t('admin.solutions.filters.collectionLabel')}
          />
        </>
      }
      actions={<ToolbarButton icon={Plus} label={t('admin.solutions.create')} onClick={onCreate} />}
    />
  );
}
