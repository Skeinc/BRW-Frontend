import { Tabs, TabsList, TabsTrigger } from './tabs';

interface SegmentedControlOption<TValue extends string> {
  value: TValue;
  label: string;
}

interface SegmentedControlProps<TValue extends string> {
  value: TValue;
  options: readonly SegmentedControlOption<TValue>[];
  onChange: (value: TValue) => void;
  ariaLabel: string;
  className?: string;
  /** Classes of the row of buttons, for example `w-full` to stretch it. */
  listClassName?: string;
}

/** A row of mutually exclusive buttons for a view setting such as a period or a sort; nothing follows it. */
export function SegmentedControl<TValue extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  className,
  listClassName,
}: SegmentedControlProps<TValue>) {
  return (
    <Tabs value={value} onValueChange={(next) => onChange(next as TValue)} className={className}>
      <TabsList aria-label={ariaLabel} className={listClassName}>
        {options.map((option) => (
          <TabsTrigger key={option.value} value={option.value}>
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
