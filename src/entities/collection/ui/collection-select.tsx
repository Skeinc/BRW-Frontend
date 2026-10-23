import { useQuery } from '@tanstack/react-query';
import { collectionOptionsQueryOptions } from '../api/collection-queries';
import { SearchableSelect } from '@/shared/ui/searchable-select';

const NONE = 'none';

interface CollectionSelectProps {
  /** Selected collection id, or an empty string for none. */
  value: string;
  onValueChange: (value: string) => void;
  /** Text of the "no collection" entry, for example "Any collection" in a filter. */
  noneLabel: string;
  ariaLabel?: string;
  id?: string;
  className?: string;
}

export function CollectionSelect({ value, onValueChange, noneLabel, ariaLabel, id, className }: CollectionSelectProps) {
  const query = useQuery(collectionOptionsQueryOptions);
  const options = [
    { value: NONE, label: noneLabel },
    ...(query.data ?? []).map((option) => ({ value: option.id, label: option.name })),
  ];
  return (
    <SearchableSelect
      value={value || NONE}
      onValueChange={(next) => onValueChange(next === NONE ? '' : next)}
      options={options}
      ariaLabel={ariaLabel}
      id={id}
      className={className}
    />
  );
}
