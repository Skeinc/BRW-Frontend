import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '@/shared/lib/utils';

export interface SearchableSelectOption {
  value: string;
  label: string;
  /** Extra left padding in rem, for nested lists. */
  indent?: number;
}

interface SearchableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  ariaLabel?: string;
  id?: string;
  className?: string;
}

/** Select with a search box inside the list; use it when the list can be long. */
export function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder,
  ariaLabel,
  id,
  className,
}: SearchableSelectProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          className={cn(
            'flex h-9 w-fit items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:hover:bg-input/50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
            !selected && 'text-muted-foreground',
            className,
          )}
        >
          <span className="line-clamp-1 text-left">{selected?.label ?? placeholder}</span>
          <ChevronDown className="size-4 opacity-50" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--radix-popover-trigger-width) min-w-48 p-0">
        <Command>
          <CommandInput placeholder={t('admin.common.searchOptions')} />
          <CommandList className="max-h-72">
            <CommandEmpty>{t('admin.common.nothingFound')}</CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.label}
                style={option.indent ? { paddingLeft: `${0.5 + option.indent}rem` } : undefined}
                onSelect={() => {
                  onValueChange(option.value);
                  setOpen(false);
                }}
              >
                <span className="line-clamp-1 flex-1">{option.label}</span>
                {option.value === value ? <Check className="size-4" aria-hidden /> : null}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
