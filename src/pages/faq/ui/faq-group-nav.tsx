import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { FaqGroup } from '../model/faq-content';

interface FaqGroupNavProps {
  groups: readonly FaqGroup[];
}

/** Topics of the page: chips in a scrolling row on small screens, a sticky list from `lg`. */
export function FaqGroupNav({ groups }: FaqGroupNavProps) {
  const { t } = useTranslation();
  return (
    <nav aria-label={t('pages.faq.groupsLabel')} className="lg:sticky lg:top-40 lg:self-start">
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
        {groups.map((group) => (
          <li key={group.id} className="shrink-0">
            <Link
              to="/faq"
              hash={`faq-${group.id}`}
              hashScrollIntoView={{ behavior: 'smooth', block: 'start' }}
              className="flex min-h-11 items-center justify-between gap-3 rounded-full border bg-card px-4 text-sm font-medium whitespace-nowrap hover:border-primary hover:text-primary lg:rounded-lg lg:border-transparent lg:bg-transparent lg:whitespace-normal lg:hover:bg-muted lg:hover:text-foreground"
            >
              {group.title}
              <span className="tabular-nums text-xs text-muted-foreground">{group.items.length}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
