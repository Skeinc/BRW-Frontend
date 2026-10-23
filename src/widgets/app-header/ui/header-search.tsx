import { useNavigate, useRouterState, useSearch } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useEffect, useState, type SubmitEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/ui/input';

const DEBOUNCE_MS = 300;

export function HeaderSearch() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isSearchPage = useRouterState({ select: (state) => state.location.pathname === '/search' });
  const urlQuery = useSearch({ strict: false, select: (search) => (typeof search.q === 'string' ? search.q : '') });
  const [query, setQuery] = useState(urlQuery);

  useEffect(() => {
    setQuery(isSearchPage ? urlQuery : '');
  }, [isSearchPage, urlQuery]);

  useEffect(() => {
    const q = query.trim();
    if (q === '' || q === urlQuery.trim()) {
      return;
    }
    const timer = window.setTimeout(() => {
      void navigate({ to: '/search', search: { q }, replace: isSearchPage });
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [query, urlQuery, isSearchPage, navigate]);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const q = query.trim();
    if (q) {
      void navigate({ to: '/search', search: { q }, replace: isSearchPage });
    }
  };
  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="relative order-last min-w-0 basis-full sm:order-none sm:basis-auto sm:flex-1"
    >
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t('header.searchPlaceholder')}
        aria-label={t('header.searchLabel')}
        className="h-12 border-transparent bg-muted pl-10"
      />
    </form>
  );
}
