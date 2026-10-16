import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Input } from './input';

const DEBOUNCE_MS = 300;

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

/** Search box that reports the typed text after a short pause, so each keystroke does not refetch or navigate. */
export function SearchInput({ value, onChange, placeholder, className }: SearchInputProps) {
  const [draft, setDraft] = useState(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (draft === value) {
      return;
    }
    const timer = setTimeout(() => onChangeRef.current(draft), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [draft, value]);

  return (
    <div className={`relative ${className ?? ''}`}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        value={draft}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 pl-9"
        onChange={(event) => setDraft(event.target.value)}
      />
    </div>
  );
}
