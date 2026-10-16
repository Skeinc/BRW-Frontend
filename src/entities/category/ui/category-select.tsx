import { useQuery } from '@tanstack/react-query';
import { categoryTreeQueryOptions } from '../api/category-queries';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

const NONE = 'none';

interface CategorySelectProps {
  /** Selected category id, or an empty string for none. */
  value: string;
  onValueChange: (value: string) => void;
  /** Text of the "no category" entry, for example "Any category" in a filter. Omit when a category is required. */
  noneLabel?: string;
  placeholder?: string;
  ariaLabel?: string;
  id?: string;
  className?: string;
}

/** Category picker that indents the nesting levels in the list; the field itself shows just the name. */
export function CategorySelect({
  value,
  onValueChange,
  noneLabel,
  placeholder,
  ariaLabel,
  id,
  className,
}: CategorySelectProps) {
  const tree = useQuery(categoryTreeQueryOptions);
  return (
    <Select value={value || (noneLabel ? NONE : '')} onValueChange={(next) => onValueChange(next === NONE ? '' : next)}>
      <SelectTrigger id={id} aria-label={ariaLabel} className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {noneLabel ? <SelectItem value={NONE}>{noneLabel}</SelectItem> : null}
        {(tree.data ?? []).map((category) => (
          <SelectItem
            key={category.id}
            value={category.id}
            style={{ paddingLeft: `${0.5 + (category.depth - 1) * 1.25}rem` }}
          >
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
