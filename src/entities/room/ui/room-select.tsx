import { useQuery } from '@tanstack/react-query';
import { SearchableSelect } from '@/shared/ui/searchable-select';
import { roomOptionsQueryOptions } from '../api/room-queries';

const NONE = 'none';

interface RoomSelectProps {
  /** Selected room id, or an empty string for none. */
  value: string;
  onValueChange: (value: string) => void;
  /** Text of the "no room" entry, for example "Any room" in a filter. */
  noneLabel: string;
  ariaLabel?: string;
  id?: string;
  className?: string;
}

export function RoomSelect({ value, onValueChange, noneLabel, ariaLabel, id, className }: RoomSelectProps) {
  const query = useQuery(roomOptionsQueryOptions);
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
