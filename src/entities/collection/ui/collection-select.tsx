import { useQuery } from '@tanstack/react-query';
import { collectionOptionsQueryOptions } from '../api/collection-queries';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

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
  const options = useQuery(collectionOptionsQueryOptions);
  return (
    <Select value={value || NONE} onValueChange={(next) => onValueChange(next === NONE ? '' : next)}>
      <SelectTrigger id={id} aria-label={ariaLabel} className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE}>{noneLabel}</SelectItem>
        {(options.data ?? []).map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
