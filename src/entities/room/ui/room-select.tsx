import { useQuery } from '@tanstack/react-query';
import { SearchableSelect } from '@/shared/ui/searchable-select';
import { roomOptionsQueryOptions } from '../api/room-queries';
import { canHostSolution } from '../model/can-host-solution';

const NONE = 'none';

interface RoomSelectProps {
  /** Selected room id, or an empty string for none. */
  value: string;
  onValueChange: (value: string) => void;
  /** Text of the "no room" entry, for example "Any room" in a filter. */
  noneLabel: string;
  /** Offer only the rooms where a solution of this collection can be made; the selected room always stays. */
  solutionCollectionId?: string;
  ariaLabel?: string;
  id?: string;
  className?: string;
}

export function RoomSelect({
  value,
  onValueChange,
  noneLabel,
  solutionCollectionId,
  ariaLabel,
  id,
  className,
}: RoomSelectProps) {
  const query = useQuery(roomOptionsQueryOptions);
  const rooms = (query.data ?? []).filter(
    (room) => !solutionCollectionId || room.id === value || canHostSolution(room, solutionCollectionId),
  );
  const options = [
    { value: NONE, label: noneLabel },
    ...rooms.map((option) => ({ value: option.id, label: option.name })),
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
