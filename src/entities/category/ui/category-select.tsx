import { useQuery } from '@tanstack/react-query';
import { categoryTreeQueryOptions } from '../api/category-queries';
import { SearchableSelect } from '@/shared/ui/searchable-select';

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
  const options = [
    ...(noneLabel ? [{ value: NONE, label: noneLabel }] : []),
    ...(tree.data ?? []).map((category) => ({
      value: category.id,
      label: category.name,
      indent: (category.depth - 1) * 1.25,
    })),
  ];
  return (
    <SearchableSelect
      value={value || (noneLabel ? NONE : '')}
      onValueChange={(next) => onValueChange(next === NONE ? '' : next)}
      options={options}
      placeholder={placeholder}
      ariaLabel={ariaLabel}
      id={id}
      className={className}
    />
  );
}
