import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PageBreadcrumbsProps {
  current: string;
}

export function PageBreadcrumbs({ current }: PageBreadcrumbsProps) {
  const { t } = useTranslation();
  return (
    <nav aria-label={t('nav.breadcrumbs')} className="mb-6 text-sm text-muted-foreground">
      <ol className="flex items-center gap-1">
        <li>
          <Link to="/" className="hover:text-primary">
            {t('nav.home')}
          </Link>
        </li>
        <li aria-hidden>
          <ChevronRight className="size-4" />
        </li>
        <li aria-current="page" className="font-semibold text-foreground">
          {current}
        </li>
      </ol>
    </nav>
  );
}
