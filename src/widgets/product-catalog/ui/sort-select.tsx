import { useTranslation } from 'react-i18next';
import { CATALOG_SORTS, type CatalogProductSort } from '@/entities/product';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

interface SortSelectProps {
  value: CatalogProductSort | undefined;
  onChange: (value: CatalogProductSort | undefined) => void;
}

const DEFAULT_SORT: CatalogProductSort = 'popular';

export function SortSelect({ value, onChange }: SortSelectProps) {
  const { t } = useTranslation();
  return (
    <Select
      value={value ?? DEFAULT_SORT}
      onValueChange={(next) => {
        const sort = CATALOG_SORTS.find((candidate) => candidate === next);
        onChange(sort === DEFAULT_SORT ? undefined : sort);
      }}
    >
      <SelectTrigger aria-label={t('catalog.sort.label')} className="w-full min-w-44 bg-card sm:w-52">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {CATALOG_SORTS.map((sort) => (
          <SelectItem key={sort} value={sort}>
            {t(`catalog.sort.${sort}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
