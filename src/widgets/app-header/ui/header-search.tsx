import { useNavigate } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useState, type SubmitEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/ui/input';

export function HeaderSearch() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const q = query.trim();
    if (q) {
      void navigate({ to: '/search', search: { q } });
    }
  };
  return (
    <form role="search" onSubmit={handleSubmit} className="relative min-w-0 flex-1">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t('header.searchPlaceholder')}
        aria-label={t('header.searchLabel')}
        className="h-11 bg-background pl-9"
      />
    </form>
  );
}
